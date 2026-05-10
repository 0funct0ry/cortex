use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::path::Path;

pub const CORTEX_SECTION_HEADER: &str = "# Cortex local-only files";
pub const DEFAULT_ENTRIES: &[&str] = &[".env", ".cortex-ai.yaml"];

pub struct GitIgnoreManager;

impl GitIgnoreManager {
    /// Ensures that the .gitignore file in the given directory contains the required Cortex entries.
    /// If the file doesn't exist, it's created. If it exists, entries are appended if missing.
    pub fn ensure_gitignore(dir: &Path) -> Result<bool, std::io::Error> {
        let path = dir.join(".gitignore");
        let mut updated = false;

        if !path.exists() {
            let mut file = fs::File::create(&path)?;
            writeln!(file, "{}", CORTEX_SECTION_HEADER)?;
            for entry in DEFAULT_ENTRIES {
                writeln!(file, "{}", entry)?;
            }
            return Ok(true);
        }

        let file = fs::File::open(&path)?;
        let reader = BufReader::new(file);
        let lines: Vec<String> = reader.lines().collect::<Result<_, _>>()?;

        let mut has_header = false;
        let mut existing_entries = std::collections::HashSet::new();

        for line in &lines {
            let trimmed = line.trim();
            if trimmed == CORTEX_SECTION_HEADER {
                has_header = true;
            }
            if DEFAULT_ENTRIES.contains(&trimmed) {
                existing_entries.insert(trimmed.to_string());
            }
        }

        let mut to_add = Vec::new();
        for entry in DEFAULT_ENTRIES {
            if !existing_entries.contains(*entry) {
                to_add.push(*entry);
            }
        }

        if !has_header || !to_add.is_empty() {
            let mut file = fs::OpenOptions::new().append(true).open(&path)?;

            if !has_header {
                // If there's no header, we add it.
                // We might want to add a newline before if the file is not empty and doesn't end with one.
                if !lines.is_empty() && !lines.last().unwrap().is_empty() {
                    writeln!(file)?;
                }
                writeln!(file, "{}", CORTEX_SECTION_HEADER)?;
                updated = true;
            }

            for entry in to_add {
                writeln!(file, "{}", entry)?;
                updated = true;
            }
        }

        Ok(updated)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn test_ensure_gitignore_new() {
        let dir = tempdir().unwrap();
        let updated = GitIgnoreManager::ensure_gitignore(dir.path()).unwrap();
        assert!(updated);

        let content = fs::read_to_string(dir.path().join(".gitignore")).unwrap();
        assert!(content.contains(CORTEX_SECTION_HEADER));
        assert!(content.contains(".env"));
        assert!(content.contains(".cortex-ai.yaml"));
    }

    #[test]
    fn test_ensure_gitignore_exists_but_missing_entries() {
        let dir = tempdir().unwrap();
        let path = dir.path().join(".gitignore");
        fs::write(&path, "node_modules\n").unwrap();

        let updated = GitIgnoreManager::ensure_gitignore(dir.path()).unwrap();
        assert!(updated);

        let content = fs::read_to_string(&path).unwrap();
        assert!(content.contains("node_modules"));
        assert!(content.contains(CORTEX_SECTION_HEADER));
        assert!(content.contains(".env"));
    }

    #[test]
    fn test_ensure_gitignore_no_duplicates() {
        let dir = tempdir().unwrap();
        let path = dir.path().join(".gitignore");
        fs::write(&path, format!("{}\n.env\n", CORTEX_SECTION_HEADER)).unwrap();

        let updated = GitIgnoreManager::ensure_gitignore(dir.path()).unwrap();
        // It will still try to add .cortex-ai.yaml
        assert!(updated);

        let content = fs::read_to_string(&path).unwrap();
        let env_count = content.matches(".env").count();
        assert_eq!(env_count, 1);
        assert!(content.contains(".cortex-ai.yaml"));
    }

    #[test]
    fn test_ensure_gitignore_all_present() {
        let dir = tempdir().unwrap();
        let path = dir.path().join(".gitignore");
        fs::write(&path, format!("{}\n.env\n.cortex-ai.yaml\n", CORTEX_SECTION_HEADER)).unwrap();

        let updated = GitIgnoreManager::ensure_gitignore(dir.path()).unwrap();
        assert!(!updated);
    }
}
