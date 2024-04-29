db.createCollection("AdminUser")
db.createCollection('Application')
db.createCollection('Message')
db.createCollection('Project')
db.createCollection('ProfessionalUser')
db.createCollection('CompanyUser')
db.AdminUser.insert( { "email": "admin@mail.com", "password": "admin", "user_type": 3, "uid": 1 } )

