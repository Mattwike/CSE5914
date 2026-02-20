from Crypto.Hash import BLAKE2b
from Crypto.Cipher import Salsa20
from Crypto.Random import get_random_bytes

class CryptoManager:

    def encrypt_data(self, data: str, key: bytes) -> bytes:
        #encodes the dat using Salsa20
        cipher = Salsa20.new(key=key)
        return cipher.nonce + cipher.encrypt(data.encode())

    def decrypt_data(self, encoded_data: bytes, key: bytes) -> str:
        #decodes data using Salsa20
        nonce = encoded_data[:8]
        ciphertext = encoded_data[8:]
        
        cipher = Salsa20.new(key=key, nonce=nonce)
        return cipher.decrypt(ciphertext)

    def hash_data(self, data: bytes) -> str:
        #Generate a BLAKE2b hash
        hasher = BLAKE2b.new(digest_bits=256)
        hasher.update(data)
        return hasher.hexdigest()

    def verify_hash(self, data: bytes, expected_hash: str) -> bool:
        #verifies the data is the correct hash
        return self.hash_data(data) == expected_hash

    def generate_key(self, length: int = 32) -> bytes:
        #Generates a random key for Salsa20
        return get_random_bytes(length)