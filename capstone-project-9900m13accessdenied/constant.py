from enum import Enum

class Code(Enum):
    SUCCESS = 200
    ERROR = 404
    REDIRECT = 300
    
# status for project
class Status(Enum):
    OPEN = "open"
    COMPLETED = "completed"
    ONGOING = "ongoing"

