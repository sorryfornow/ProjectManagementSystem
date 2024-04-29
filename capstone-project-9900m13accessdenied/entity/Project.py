class Project:
    def __init__(self, project_id, project_name, company_id, start_date, end_date, status, description, participants=[]):
        self.mark_list = list(tuple)        # List of tuples (user_id, mark)
        self.project_id = project_id        # Unique identifier for the project
        self.project_name = project_name    # Name of the project
        self.company_id = company_id        # ID of the company offering the project
        self.start_date = start_date        # Project start date
        self.end_date = end_date            # Project end date
        self.status = status                # Project status (e.g., "Open", "Closed", "Ongoing")
        self.description = description      # Detailed description about the project
        self.participants = participants    # List of professionals (users) participating in the project

    def to_string(self):
        return f"{self.project_name}, {self.status}, {self.start_date}"

    def add_participant(self, user_id):
        """
        Add a participant to the project.
        """
        if user_id not in self.participants:
            self.participants.append(user_id)

    def remove_participant(self, user_id):
        """
        Remove a participant from the project.
        """
        if user_id in self.participants:
            self.participants.remove(user_id)

    def update_project_info(self, project_name=None, description=None, start_date=None, end_date=None):
        """
        Update the project details.
        """
        if project_name:
            self.project_name = project_name
        if description:
            self.description = description
        if start_date:
            self.start_date = start_date
        if end_date:
            self.end_date = end_date

    def get_avg_mark(self):
        """
        Get the average mark of the project.
        """
        sum = 0
        for mark in self.mark_list:
            sum += mark
        return sum / len(self.mark_list)
    # Additional methods can be added as needed to handle other operations.

