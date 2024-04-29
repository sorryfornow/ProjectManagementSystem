from flask_login import LoginManager, UserMixin, login_user, current_user, login_required, logout_user

PRIME = 6113

class AdminUser:
    def __init__(self, name, email, password):
        self.id = hash(email) % PRIME
        self.name = name
        self.email = email                 # Email for the company's account
        self.password = password           # Encrypted password for security (consider hashing)

    def get_userID(self):
        return self.id

    # Additional methods can be added as needed for more functionalities.
