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
pub struct ResolvedVariable {
    pub value: String,
    pub scope: VariableScope,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct UnresolvedVariableWarning {
    pub name: String,
}

#[derive(Default)]
pub struct VariableResolver {
    pub global_vars: BTreeMap<String, String>,
    pub collection_vars: BTreeMap<String, String>,
    pub env_vars: BTreeMap<String, String>,
    pub runtime_vars: BTreeMap<String, String>,
}

impl VariableResolver {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn resolve(&self, key: &str) -> Option<ResolvedVariable> {
        // Precedence: Runtime -> Environment -> Collection -> Global
        if let Some(val) = self.runtime_vars.get(key) {
            return Some(ResolvedVariable { value: val.clone(), scope: VariableScope::Runtime });
        }
        if let Some(val) = self.env_vars.get(key) {
            return Some(ResolvedVariable {
                value: val.clone(),
                scope: VariableScope::Environment,
            });
        }
        if let Some(val) = self.collection_vars.get(key) {
            return Some(ResolvedVariable { value: val.clone(), scope: VariableScope::Collection });
        }
        if let Some(val) = self.global_vars.get(key) {
            return Some(ResolvedVariable { value: val.clone(), scope: VariableScope::Global });
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

    /// Returns all variables that would be available in the current context,
    /// resolved according to precedence.
    pub fn get_all_resolved(&self) -> BTreeMap<String, ResolvedVariable> {
        let mut all = BTreeMap::new();

        // Start from lowest precedence and override
        for (k, v) in &self.global_vars {
            all.insert(
                k.clone(),
                ResolvedVariable { value: v.clone(), scope: VariableScope::Global },
            );
        }
        for (k, v) in &self.collection_vars {
            all.insert(
                k.clone(),
                ResolvedVariable { value: v.clone(), scope: VariableScope::Collection },
            );
        }
        for (k, v) in &self.env_vars {
            all.insert(
                k.clone(),
                ResolvedVariable { value: v.clone(), scope: VariableScope::Environment },
            );
        }
        for (k, v) in &self.runtime_vars {
            all.insert(
                k.clone(),
                ResolvedVariable { value: v.clone(), scope: VariableScope::Runtime },
            );
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
        resolver.global_vars.insert("a".to_string(), "global".to_string());
        resolver.collection_vars.insert("a".to_string(), "collection".to_string());
        resolver.collection_vars.insert("b".to_string(), "collection".to_string());
        resolver.env_vars.insert("b".to_string(), "env".to_string());
        resolver.runtime_vars.insert("c".to_string(), "runtime".to_string());

        // a should be collection (overrides global)
        let res_a = resolver.resolve("a").unwrap();
        assert_eq!(res_a.value, "collection");
        assert_eq!(res_a.scope, VariableScope::Collection);

        // b should be env (overrides collection)
        let res_b = resolver.resolve("b").unwrap();
        assert_eq!(res_b.value, "env");
        assert_eq!(res_b.scope, VariableScope::Environment);

        // c should be runtime
        let res_c = resolver.resolve("c").unwrap();
        assert_eq!(res_c.value, "runtime");
        assert_eq!(res_c.scope, VariableScope::Runtime);

        // non-existent
        assert!(resolver.resolve("d").is_none());
    }

    #[test]
    fn test_interpolation() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert("base_url".to_string(), "https://api.com".to_string());
        resolver.env_vars.insert("token".to_string(), "secret".to_string());

        let (interpolated, warnings) =
            resolver.interpolate("{{base_url}}/v1/users?token={{token}}&other={{missing}}");

        assert_eq!(interpolated, "https://api.com/v1/users?token=secret&other={{missing}}");
        assert_eq!(warnings.len(), 1);
        assert_eq!(warnings[0].name, "missing");
    }

    #[test]
    fn test_get_all_resolved() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert("a".to_string(), "global".to_string());
        resolver.collection_vars.insert("a".to_string(), "collection".to_string());
        resolver.env_vars.insert("b".to_string(), "env".to_string());

        let all = resolver.get_all_resolved();
        assert_eq!(all.len(), 2);
        assert_eq!(all.get("a").unwrap().value, "collection");
        assert_eq!(all.get("b").unwrap().value, "env");
    }
}
