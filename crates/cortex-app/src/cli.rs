use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "cortex", about = "Cortex AI Agent Platform", version)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Option<Commands>,
}

#[derive(Subcommand)]
pub enum Commands {
    /// Run a request or agent
    Run {
        /// The request to run
        #[arg(short, long)]
        request: Option<String>,
        /// Supply a prompt variable value in KEY=VALUE form (repeatable).
        /// Required for any collection prompt variable that has no default.
        #[arg(long = "env-var", value_name = "KEY=VALUE", action = clap::ArgAction::Append)]
        env_vars: Vec<String>,
    },
    /// Generate code or assets
    Generate {
        /// What to generate
        #[arg(short, long)]
        prompt: String,
    },
    /// Import data or agents
    Import {
        /// Path to the file to import
        #[arg(short, long)]
        path: std::path::PathBuf,
    },
    /// Export data or agents
    Export {
        /// Path to the output file
        #[arg(short, long)]
        path: std::path::PathBuf,
    },
}

/// Parses a list of "KEY=VALUE" strings into a map.
/// Returns an error string naming any entry that is not in KEY=VALUE form.
pub fn parse_env_vars(
    raw: &[String],
) -> Result<std::collections::BTreeMap<String, String>, String> {
    let mut map = std::collections::BTreeMap::new();
    for entry in raw {
        if let Some((k, v)) = entry.split_once('=') {
            if k.is_empty() {
                return Err(format!("--env-var entry has an empty key: '{entry}'"));
            }
            map.insert(k.to_string(), v.to_string());
        } else {
            return Err(format!("--env-var entry '{entry}' is not in KEY=VALUE form"));
        }
    }
    Ok(map)
}

pub fn run_cli(cli: Cli) {
    match cli.command {
        Some(Commands::Run { request, env_vars }) => {
            let provided = match parse_env_vars(&env_vars) {
                Ok(m) => m,
                Err(e) => {
                    eprintln!("error: {e}");
                    std::process::exit(1);
                }
            };

            // TODO: load the collection identified by `request`, resolve its prompt
            // variables, and validate that all required ones are covered by `provided`.
            //
            // For now, echo what was supplied so the feature is exercisable end-to-end
            // in the CLI without a full runner implementation.
            if !provided.is_empty() {
                println!("Prompt variable overrides:");
                for (k, v) in &provided {
                    println!("  {k} = {v}");
                }
            }

            println!("Running request: {:?}", request.unwrap_or_else(|| "default".to_string()));
            // TODO: Call core logic
        }
        Some(Commands::Generate { prompt }) => {
            println!("Generating: {}", prompt);
            // TODO: Call core logic
        }
        Some(Commands::Import { path }) => {
            println!("Importing from: {:?}", path);
            // TODO: Call core logic
        }
        Some(Commands::Export { path }) => {
            println!("Exporting to: {:?}", path);
            // TODO: Call core logic
        }
        None => {
            println!("No command provided. Use --help for usage.");
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_env_vars_valid() {
        let raw = vec!["KEY=value".to_string(), "ANOTHER=foo=bar".to_string()];
        let map = parse_env_vars(&raw).unwrap();
        assert_eq!(map["KEY"], "value");
        // Value may contain '=' — only the first '=' is the delimiter
        assert_eq!(map["ANOTHER"], "foo=bar");
    }

    #[test]
    fn test_parse_env_vars_empty_list() {
        let map = parse_env_vars(&[]).unwrap();
        assert!(map.is_empty());
    }

    #[test]
    fn test_parse_env_vars_missing_equals() {
        let raw = vec!["NOEQUALS".to_string()];
        assert!(parse_env_vars(&raw).is_err());
    }

    #[test]
    fn test_parse_env_vars_empty_key() {
        let raw = vec!["=value".to_string()];
        assert!(parse_env_vars(&raw).is_err());
    }

    #[test]
    fn test_parse_env_vars_empty_value_is_ok() {
        // An empty value is valid — the user explicitly cleared it
        let raw = vec!["KEY=".to_string()];
        let map = parse_env_vars(&raw).unwrap();
        assert_eq!(map["KEY"], "");
    }
}
