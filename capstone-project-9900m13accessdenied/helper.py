import hashlib


COMPANY = 1
PROF = 2
ADMIN = 3

PRIME = 6113

def gen_token(password, email):
    # Concatenate the three strings
    combined_string = password + " " + email
    # Create an MD5 hash object
    md5_hash = hashlib.md5()

    # Update the hash object with the combined string
    md5_hash.update(combined_string.encode('utf-8'))

    # Get the hexadecimal representation of the hash
    hashed_result = md5_hash.hexdigest()

    return hashed_result


def gen_uid(input_str):
    # Calculate the MD5 hash of the input string
    md5_hash = hashlib.md5(input_str.encode()).hexdigest()

    # Convert the hexadecimal hash to an integer
    decimal_hash = int(md5_hash, 16)

    # Map the hash to the desired range (1-509)
    mapped_value = (decimal_hash % (PRIME)) + 1
    return mapped_value