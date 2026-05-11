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
            },
        );
        resolver.collection_vars.insert(
            "a".to_string(),
            Variable {
                name: "a".to_string(),
                value: "collection".to_string(),
                secret: false,
                enabled: true,
            },
        );
        resolver.collection_vars.insert(
            "b".to_string(),
            Variable {
                name: "b".to_string(),
                value: "collection".to_string(),
                secret: false,
                enabled: true,
            },
        );
        resolver.env_vars.insert(
            "b".to_string(),
            Variable {
                name: "b".to_string(),
                value: "env".to_string(),
                secret: false,
                enabled: true,
            },
        );
        resolver.runtime_vars.insert(
            "c".to_string(),
            Variable {
                name: "c".to_string(),
                value: "runtime".to_string(),
                secret: false,
                enabled: true,
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
            },
        );
        resolver.env_vars.insert(
            "token".to_string(),
            Variable {
                name: "token".to_string(),
                value: "secret".to_string(),
                secret: true,
                enabled: true,
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
            },
        );
        resolver.collection_vars.insert(
            "a".to_string(),
            Variable {
                name: "a".to_string(),
                value: "collection".to_string(),
                secret: false,
                enabled: true,
            },
        );
        resolver.env_vars.insert(
            "b".to_string(),
            Variable {
                name: "b".to_string(),
                value: "env".to_string(),
                secret: false,
                enabled: true,
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
            },
        );

        assert!(resolver.resolve("a").is_none());
        let (interpolated, _) = resolver.interpolate("{{a}}");
        assert_eq!(interpolated, "{{a}}");
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
            },
        );
        resolver.global_vars.insert(
            "public_id".to_string(),
            Variable {
                name: "public_id".to_string(),
                value: "123".to_string(),
                secret: false,
                enabled: true,
            },
        );

        let (interpolated, _) = resolver.interpolate_masked("ID: {{public_id}}, Key: {{api_key}}");
        assert_eq!(interpolated, "ID: 123, Key: ********");

        let (normal, _) = resolver.interpolate("ID: {{public_id}}, Key: {{api_key}}");
        assert_eq!(normal, "ID: 123, Key: super-secret");
    }
}
