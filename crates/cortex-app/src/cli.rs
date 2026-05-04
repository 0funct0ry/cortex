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

pub fn run_cli(cli: Cli) {
    match cli.command {
        Some(Commands::Run { request }) => {
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
            // This should not happen if run_cli is called only when command is Some
            // but we'll handle it for safety.
            println!("No command provided. Use --help for usage.");
        }
    }
}
