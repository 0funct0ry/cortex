pub mod collection;
pub mod crypto;
pub mod environment;
pub mod request;

pub fn hello_from_core() -> &'static str {
    "Hello from Cortex Core!"
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        assert_eq!(hello_from_core(), "Hello from Cortex Core!");
    }
}
