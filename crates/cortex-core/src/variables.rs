use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::BTreeMap;

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord, Clone, Copy, Type)]
#[serde(rename_all = "lowercase")]
pub enum VariableScope {
    Global,
    Collection,
    Environment,
    Runtime,
}

impl std::fmt::Display for VariableScope {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            VariableScope::Global => write!(f, "global"),
            VariableScope::Collection => write!(f, "collection"),
            VariableScope::Environment => write!(f, "environment"),
            VariableScope::Runtime => write!(f, "runtime"),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct Variable {
    pub name: String,
    pub value: String,
    #[serde(default)]
    pub secret: bool,
    #[serde(default = "default_true")]
    pub enabled: bool,
    /// If true, the user is asked to supply a value before each collection run.
    /// The `value` field serves as the pre-filled default shown in the prompt dialog.
    #[serde(default)]
    pub prompt: bool,
    /// Optional hint shown beneath the input in the prompt dialog.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

fn default_true() -> bool {
    true
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct ResolvedVariable {
    pub value: String,
    pub scope: VariableScope,
    pub secret: bool,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct UnresolvedVariableWarning {
    pub name: String,
}

#[derive(Default)]
pub struct VariableResolver {
    pub global_vars: BTreeMap<String, Variable>,
    pub collection_vars: BTreeMap<String, Variable>,
    pub env_vars: BTreeMap<String, Variable>,
    pub runtime_vars: BTreeMap<String, Variable>,
}

impl VariableResolver {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn resolve(&self, key: &str) -> Option<ResolvedVariable> {
        // Precedence: Runtime -> Environment -> Collection -> Global
        // Only resolve if enabled
        if let Some(var) = self.runtime_vars.get(key) {
            if var.enabled {
                return Some(ResolvedVariable {
                    value: var.value.clone(),
                    scope: VariableScope::Runtime,
                    secret: var.secret,
                });
            }
        }
        if let Some(var) = self.env_vars.get(key) {
            if var.enabled {
                return Some(ResolvedVariable {
                    value: var.value.clone(),
                    scope: VariableScope::Environment,
                    secret: var.secret,
                });
            }
        }
        if let Some(var) = self.collection_vars.get(key) {
            if var.enabled {
                return Some(ResolvedVariable {
                    value: var.value.clone(),
                    scope: VariableScope::Collection,
                    secret: var.secret,
                });
            }
        }
        if let Some(var) = self.global_vars.get(key) {
            if var.enabled {
                return Some(ResolvedVariable {
                    value: var.value.clone(),
                    scope: VariableScope::Global,
                    secret: var.secret,
                });
            }
        }
        None
    }

    /// Interpolates variables in a string.
    /// Returns the interpolated string and a list of warnings for unresolved variables.
    pub fn interpolate(&self, text: &str) -> (String, Vec<UnresolvedVariableWarning>) {
        let mut result = String::new();
        let mut warnings = Vec::new();
        let mut current = text;

        while let Some(start) = current.find("{{") {
            result.push_str(&current[..start]);
            let remaining = &current[start + 2..];
            if let Some(end) = remaining.find("}}") {
                let key = remaining[..end].trim();
                if let Some(resolved) = self.resolve(key) {
                    result.push_str(&resolved.value);
                } else {
                    // Keep the original placeholder but add a warning
                    result.push_str("{{");
                    result.push_str(&remaining[..end]);
                    result.push_str("}}");
                    warnings.push(UnresolvedVariableWarning { name: key.to_string() });
                }
                current = &remaining[end + 2..];
            } else {
                // No closing }} found, just push the rest and break
                result.push_str("{{");
                current = remaining;
                break;
            }
        }
        result.push_str(current);

        (result, warnings)
    }

    /// Interpolates variables in a string, masking secrets with `********`.
    pub fn interpolate_masked(&self, text: &str) -> (String, Vec<UnresolvedVariableWarning>) {
        let mut result = String::new();
        let mut warnings = Vec::new();
        let mut current = text;

        while let Some(start) = current.find("{{") {
            result.push_str(&current[..start]);
            let remaining = &current[start + 2..];
            if let Some(end) = remaining.find("}}") {
                let key = remaining[..end].trim();
                if let Some(resolved) = self.resolve(key) {
                    if resolved.secret {
                        result.push_str("********");
                    } else {
                        result.push_str(&resolved.value);
                    }
                } else {
                    result.push_str("{{");
                    result.push_str(&remaining[..end]);
                    result.push_str("}}");
                    warnings.push(UnresolvedVariableWarning { name: key.to_string() });
                }
                current = &remaining[end + 2..];
            } else {
                result.push_str("{{");
                current = remaining;
                break;
            }
        }
        result.push_str(current);

        (result, warnings)
    }

    /// Returns all variables that would be available in the current context,
    /// resolved according to precedence.
    pub fn get_all_resolved(&self) -> BTreeMap<String, ResolvedVariable> {
        let mut all = BTreeMap::new();

        // Start from lowest precedence and override
        // Only include enabled variables
        for (k, v) in &self.global_vars {
            if v.enabled {
                all.insert(
                    k.clone(),
                    ResolvedVariable {
                        value: v.value.clone(),
                        scope: VariableScope::Global,
                        secret: v.secret,
                    },
                );
            }
        }
        for (k, v) in &self.collection_vars {
            if v.enabled {
                all.insert(
                    k.clone(),
                    ResolvedVariable {
                        value: v.value.clone(),
                        scope: VariableScope::Collection,
                        secret: v.secret,
                    },
                );
            }
        }
        for (k, v) in &self.env_vars {
            if v.enabled {
                all.insert(
                    k.clone(),
                    ResolvedVariable {
                        value: v.value.clone(),
                        scope: VariableScope::Environment,
                        secret: v.secret,
                    },
                );
            }
        }
        for (k, v) in &self.runtime_vars {
            if v.enabled {
                all.insert(
                    k.clone(),
                    ResolvedVariable {
                        value: v.value.clone(),
                        scope: VariableScope::Runtime,
                        secret: v.secret,
                    },
                );
            }
        }

        all
    }

    /// Returns all enabled prompt variables from the collection and environment scopes
    /// that do not already have a runtime (ephemeral) override.
    ///
    /// These are the variables the user must be asked to fill in before a collection run.
    pub fn pending_prompt_variables(&self) -> Vec<&Variable> {
        let mut pending = Vec::new();

        // Check collection-scope prompt variables
        for var in self.collection_vars.values() {
            if var.prompt && var.enabled && !self.runtime_vars.contains_key(&var.name) {
                pending.push(var);
            }
        }

        // Check env-scope prompt variables (may overlap with collection; env takes precedence)
        for var in self.env_vars.values() {
            if var.prompt && var.enabled && !self.runtime_vars.contains_key(&var.name) {
                // Replace any collection-level entry for the same name
                if let Some(pos) = pending.iter().position(|v| v.name == var.name) {
                    pending[pos] = var;
                } else {
                    pending.push(var);
                }
            }
        }

        // Sort by name for stable, predictable ordering in the dialog
        pending.sort_by(|a, b| a.name.cmp(&b.name));
        pending
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_precedence() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert(
            "a".to_string(),
            Variable {
                name: "a".to_string(),
                value: "global".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.collection_vars.insert(
            "a".to_string(),
            Variable {
                name: "a".to_string(),
                value: "collection".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.collection_vars.insert(
            "b".to_string(),
            Variable {
                name: "b".to_string(),
                value: "collection".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.env_vars.insert(
            "b".to_string(),
            Variable {
                name: "b".to_string(),
                value: "env".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.runtime_vars.insert(
            "c".to_string(),
            Variable {
                name: "c".to_string(),
                value: "runtime".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );

        // a should be collection (overrides global)
        let res_a = resolver.resolve("a").unwrap();
        assert_eq!(res_a.value, "collection");
        assert_eq!(res_a.scope, VariableScope::Collection);
        assert!(!res_a.secret);

        // b should be env (overrides collection)
        let res_b = resolver.resolve("b").unwrap();
        assert_eq!(res_b.value, "env");
        assert_eq!(res_b.scope, VariableScope::Environment);
        assert!(!res_b.secret);

        // c should be runtime
        let res_c = resolver.resolve("c").unwrap();
        assert_eq!(res_c.value, "runtime");
        assert_eq!(res_c.scope, VariableScope::Runtime);
        assert!(!res_c.secret);

        // non-existent
        assert!(resolver.resolve("d").is_none());
    }

    #[test]
    fn test_interpolation() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert(
            "base_url".to_string(),
            Variable {
                name: "base_url".to_string(),
                value: "https://api.com".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.env_vars.insert(
            "token".to_string(),
            Variable {
                name: "token".to_string(),
                value: "secret".to_string(),
                secret: true,
                enabled: true,
                prompt: false,
                description: None,
            },
        );

        let (interpolated, warnings) =
            resolver.interpolate("{{base_url}}/v1/users?token={{token}}&other={{missing}}");

        assert_eq!(interpolated, "https://api.com/v1/users?token=secret&other={{missing}}");
        assert_eq!(warnings.len(), 1);
        assert_eq!(warnings[0].name, "missing");
    }

    #[test]
    fn test_get_all_resolved() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert(
            "a".to_string(),
            Variable {
                name: "a".to_string(),
                value: "global".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.collection_vars.insert(
            "a".to_string(),
            Variable {
                name: "a".to_string(),
                value: "collection".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.env_vars.insert(
            "b".to_string(),
            Variable {
                name: "b".to_string(),
                value: "env".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );

        let all = resolver.get_all_resolved();
        assert_eq!(all.len(), 2);
        assert_eq!(all.get("a").unwrap().value, "collection");
        assert!(!all.get("a").unwrap().secret);
        assert_eq!(all.get("b").unwrap().value, "env");
        assert!(!all.get("b").unwrap().secret);
    }

    #[test]
    fn test_enabled_toggle() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert(
            "a".to_string(),
            Variable {
                name: "a".to_string(),
                value: "val".to_string(),
                secret: false,
                enabled: false,
                prompt: false,
                description: None,
            },
        );

        assert!(resolver.resolve("a").is_none());
        let (interpolated, _) = resolver.interpolate("{{a}}");
        assert_eq!(interpolated, "{{a}}");
    }

    #[test]
    fn test_ephemeral_runtime_override() {
        // Ephemeral variables live at Runtime scope and override all other scopes.
        let mut resolver = VariableResolver::new();

        // Same key at every scope level
        let make = |value: &str, enabled: bool| Variable {
            name: "API_KEY".to_string(),
            value: value.to_string(),
            secret: false,
            enabled,
            prompt: false,
            description: None,
        };

        resolver.global_vars.insert("API_KEY".to_string(), make("global-key", true));
        resolver.collection_vars.insert("API_KEY".to_string(), make("collection-key", true));
        resolver.env_vars.insert("API_KEY".to_string(), make("env-key", true));
        // Ephemeral (session) variable sits at runtime level
        resolver.runtime_vars.insert("API_KEY".to_string(), make("ephemeral-key", true));

        let resolved = resolver.resolve("API_KEY").unwrap();
        assert_eq!(resolved.value, "ephemeral-key");
        assert_eq!(resolved.scope, VariableScope::Runtime);

        // When the ephemeral var is disabled, fall through to environment
        resolver.runtime_vars.insert("API_KEY".to_string(), make("ephemeral-key", false));
        let resolved = resolver.resolve("API_KEY").unwrap();
        assert_eq!(resolved.value, "env-key");
        assert_eq!(resolved.scope, VariableScope::Environment);

        // Removing the ephemeral var entirely falls through to environment
        resolver.runtime_vars.clear();
        let resolved = resolver.resolve("API_KEY").unwrap();
        assert_eq!(resolved.value, "env-key");
        assert_eq!(resolved.scope, VariableScope::Environment);

        // Interpolation reflects runtime override
        resolver.runtime_vars.insert("API_KEY".to_string(), make("session-token", true));
        let (text, warnings) = resolver.interpolate("Bearer {{API_KEY}}");
        assert_eq!(text, "Bearer session-token");
        assert!(warnings.is_empty());
    }

    #[test]
    fn test_masked_interpolation() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert(
            "api_key".to_string(),
            Variable {
                name: "api_key".to_string(),
                value: "super-secret".to_string(),
                secret: true,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.global_vars.insert(
            "public_id".to_string(),
            Variable {
                name: "public_id".to_string(),
                value: "123".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );

        let (interpolated, _) = resolver.interpolate_masked("ID: {{public_id}}, Key: {{api_key}}");
        assert_eq!(interpolated, "ID: 123, Key: ********");

        let (normal, _) = resolver.interpolate("ID: {{public_id}}, Key: {{api_key}}");
        assert_eq!(normal, "ID: 123, Key: super-secret");
    }

    #[test]
    fn test_prompt_variable_field_serialization() {
        // A prompt variable with a description round-trips through YAML correctly.
        let var = Variable {
            name: "region".to_string(),
            value: "us-east-1".to_string(),
            secret: false,
            enabled: true,
            prompt: true,
            description: Some("AWS region to deploy to".to_string()),
        };
        let yaml = serde_yaml::to_string(&var).expect("serialize");
        let back: Variable = serde_yaml::from_str(&yaml).expect("deserialize");
        assert_eq!(back.prompt, true);
        assert_eq!(back.description.as_deref(), Some("AWS region to deploy to"));
        assert_eq!(back.value, "us-east-1");

        // A plain variable (no prompt fields in YAML) deserializes with prompt=false.
        let plain_yaml = "name: token\nvalue: abc\n";
        let plain: Variable = serde_yaml::from_str(plain_yaml).expect("deserialize plain");
        assert!(!plain.prompt);
        assert!(plain.description.is_none());

        // description is omitted from serialized YAML when None (skip_serializing_if).
        let no_desc = Variable {
            name: "x".to_string(),
            value: "y".to_string(),
            secret: false,
            enabled: true,
            prompt: true,
            description: None,
        };
        let no_desc_yaml = serde_yaml::to_string(&no_desc).expect("serialize no_desc");
        assert!(!no_desc_yaml.contains("description"));
    }

    #[test]
    fn test_pending_prompt_variables() {
        let make_prompt = |name: &str, value: &str| Variable {
            name: name.to_string(),
            value: value.to_string(),
            secret: false,
            enabled: true,
            prompt: true,
            description: None,
        };
        let make_plain = |name: &str| Variable {
            name: name.to_string(),
            value: "x".to_string(),
            secret: false,
            enabled: true,
            prompt: false,
            description: None,
        };

        let mut resolver = VariableResolver::new();
        resolver.collection_vars.insert("region".to_string(), make_prompt("region", "us-east-1"));
        resolver.collection_vars.insert("env".to_string(), make_prompt("env", "staging"));
        resolver.collection_vars.insert("plain".to_string(), make_plain("plain"));

        // All prompt vars pending — no runtime override yet
        let pending = resolver.pending_prompt_variables();
        assert_eq!(pending.len(), 2);
        let names: Vec<&str> = pending.iter().map(|v| v.name.as_str()).collect();
        assert!(names.contains(&"region"));
        assert!(names.contains(&"env"));

        // Satisfy "region" via runtime override — it should drop from pending
        resolver.runtime_vars.insert(
            "region".to_string(),
            Variable {
                name: "region".to_string(),
                value: "eu-west-1".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        let pending2 = resolver.pending_prompt_variables();
        assert_eq!(pending2.len(), 1);
        assert_eq!(pending2[0].name, "env");

        // Env-scope prompt variable overrides collection-scope entry for same name
        resolver.env_vars.insert(
            "env".to_string(),
            Variable {
                name: "env".to_string(),
                value: "production".to_string(),
                secret: false,
                enabled: true,
                prompt: true,
                description: Some("Target environment".to_string()),
            },
        );
        let pending3 = resolver.pending_prompt_variables();
        assert_eq!(pending3.len(), 1);
        assert_eq!(pending3[0].value, "production"); // env-scope value wins
        assert_eq!(pending3[0].description.as_deref(), Some("Target environment"));

        // Disabled prompt vars are excluded
        resolver.collection_vars.insert(
            "disabled".to_string(),
            Variable {
                name: "disabled".to_string(),
                value: "".to_string(),
                secret: false,
                enabled: false,
                prompt: true,
                description: None,
            },
        );
        let pending4 = resolver.pending_prompt_variables();
        assert!(!pending4.iter().any(|v| v.name == "disabled"));
    }
}
