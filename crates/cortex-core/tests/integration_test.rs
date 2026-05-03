use std::env;
use std::fs;

#[test]
fn test_filesystem_access() {
    let mut temp_dir = env::temp_dir();
    temp_dir.push("cortex_test_dir");

    // Create directory
    fs::create_dir_all(&temp_dir).expect("Failed to create temp directory");

    // Create file
    let file_path = temp_dir.join("test_file.txt");
    fs::write(&file_path, "Cortex Integration Test").expect("Failed to write to file");

    // Read file
    let content = fs::read_to_string(&file_path).expect("Failed to read from file");
    assert_eq!(content, "Cortex Integration Test");

    // Cleanup
    fs::remove_dir_all(&temp_dir).expect("Failed to cleanup temp directory");
}

#[test]
fn test_core_functionality() {
    assert_eq!(cortex_core::hello_from_core(), "Hello from Cortex Core!");
}
