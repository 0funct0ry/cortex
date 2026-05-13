// Example of environment management
use cortex_core::environment::EnvironmentFile;
use cortex_core::variables::Variable;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let key = [0u8; 32]; // Mock 32-byte key

    println!("--- Step 1: Create a new Environment ---");
    let mut env = EnvironmentFile::new("production".to_string());
    env.variables.push(Variable {
        name: "DB_PASSWORD".to_string(),
        value: serde_json::json!("super-secret-password"),
        secret: true,
        enabled: true,
        prompt: false,
        description: None,
    });
    env.variables.push(Variable {
        name: "API_URL".to_string(),
        value: serde_json::json!("https://api.example.com"),
        secret: false,
        enabled: true,
        prompt: false,
        description: None,
    });

    println!("Original Environment:\n{}", env.to_yaml()?);

    println!("--- Step 2: Encrypt Secrets ---");
    env.encrypt_secrets(&key)?;
    let encrypted_yaml = env.to_yaml()?;
    println!("Encrypted YAML (Safe to commit to Git):\n{}", encrypted_yaml);

    println!("--- Step 3: Decrypt Secrets ---");
    let mut decoded = EnvironmentFile::from_yaml(&encrypted_yaml)?;
    decoded.decrypt_secrets(&key)?;
    println!("Decrypted Environment:\n{}", decoded.to_yaml()?);

    Ok(())
}
