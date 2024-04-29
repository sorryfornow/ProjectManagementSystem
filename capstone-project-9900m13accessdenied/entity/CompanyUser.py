from flask_login import LoginManager, UserMixin, login_user, current_user, login_required, logout_user

PRIME = 6113

class CompanyUser:
    def __init__(self, company_name, email, password, projects=[]):
        self.id = hash(email) % PRIME
        self.company_name = company_name   # Name of the company
        self.email = email                 # Email for the company's account
        self.password = password           # Encrypted password for security (consider hashing)
        self.projects = projects           # List of projects associated with the company


    def get_userID(self):
        return self.id

    def create_project(self, project):
        """
        Create a new project and associate it with the company.
        """
        self.projects.append(project)

    def edit_company_info(self, company_name=None, email=None):
        """
        Edit the company's details.
        """
        if company_name:
            self.company_name = company_name
        if email:
            self.email = email

    def view_projects(self):
        """
        View all projects associated with the company.
        """
        return self.projects

    def approve_professional(self, project, user_id):
        """
        Approve a professional user to join a project.
        """
        if project in self.projects:
            project.add_participant(user_id)

    def rate_professional(self, user_id, rating):
        """
        Rate a professional based on their contribution to a project.
        """
        # TODO: Implement a rating system. This is a placeholder.
        # Get the professional user object from the database
        # Update the professional's average rating
        pass

    # Additional methods can be added as needed for more functionalities.

