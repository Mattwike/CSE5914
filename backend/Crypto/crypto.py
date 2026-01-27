from Crypto.Hash import BLAKE2b
from Crypto.Cipher import Salsa20
from Crypto.Random import get_random_bytes

def encode_data(data: str, key: bytes) -> bytes:
    #encodes the dat using Salsa20
    cipher = Salsa20.new(key=key)
    return cipher.nonce + cipher.encrypt(data.encode())

def decode_data(encoded_data: bytes, key: bytes, nonce: bytes) -> str:
    #decodes data using Salsa20
    cipher = Salsa20.new(key=key, nonce=nonce)
    return cipher.decrypt(encoded_data).decode()

def hash_data(data: bytes) -> str:
    #Generate a BLAKE2b hash
    hasher = BLAKE2b.new(digest_bits=256)
    hasher.update(data)
    return hasher.hexdigest()

def verify_hash(data: bytes, expected_hash: str) -> bool:
    #verifies the data is the correct hash
    return hash_data(data) == expected_hash

def generate_key(length: int = 32) -> bytes:
    #Generates a random key for Salsa20
    return get_random_bytes(length)