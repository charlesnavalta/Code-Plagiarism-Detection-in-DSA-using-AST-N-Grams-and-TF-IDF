from models import User
from flask_bcrypt import generate_password_hash

users_to_seed = [
    {"email": "admin@test.com", "username": "admin", "password": "admin123", "role": "admin", "status": "active", "is_verified": True},
    {"email": "renz@gmail.com", "username": "Renz", "password": "renz123", "role": "instructor", "status": "active", "is_verified": True},
    {"email": "doca@gmail.com", "username": "Doca", "password": "doca123", "role": "instructor", "status": "active", "is_verified": True},
    {"email": "ba@gmail.com", "username": "Ba", "password": "ba123", "role": "instructor", "status": "active", "is_verified": True},
    {"email": "janus@gmail.com", "username": "Janus", "password": "janus123", "role": "instructor", "status": "active", "is_verified": True},
    {"email": "mary@gmail.com", "username": "Mary", "password": "mary123", "role": "student", "status": "active", "is_verified": True},
    {"email": "charles@gmail.com", "username": "Charles", "password": "charles123", "role": "student", "status": "active", "is_verified": True},
    {"email": "nicolo@gmail.com", "username": "Nicolo", "password": "nicolo123", "role": "student", "status": "active", "is_verified": True},
    {"email": "dan@gmail.com", "username": "Dan", "password": "dan123", "role": "student", "status": "active", "is_verified": True},
    {"email": "ramon@gmail.com", "username": "Ramon", "password": "ramon123", "role": "student", "status": "active", "is_verified": True},
    {"email": "jude@gmail.com", "username": "Jude", "password": "jude123", "role": "student", "status": "active", "is_verified": True},
    {"email": "jm@gmail.com", "username": "Jm", "password": "jm123", "role": "student", "status": "active", "is_verified": True},
    {"email": "patrick@gmail.com", "username": "Patrick", "password": "patrick123", "role": "student", "status": "active", "is_verified": True},
    {"email": "rachel@gmail.com", "username": "Rachel", "password": "rachel123", "role": "student", "status": "active", "is_verified": True},
    {"email": "karo@gmail.com", "username": "Karo", "password": "karo123", "role": "student", "status": "active", "is_verified": True},
    {"email": "sol@gmail.com", "username": "Sol", "password": "sol123", "role": "student", "status": "active", "is_verified": True},
    {"email": "ramil@gmail.com", "username": "Ramil", "password": "ramil123", "role": "student", "status": "active", "is_verified": True},
    {"email": "alex@gmail.com", "username": "Alex", "password": "alex123", "role": "student", "status": "active", "is_verified": True},
    {"email": "sam@gmail.com", "username": "Sam", "password": "sam123", "role": "student", "status": "active", "is_verified": True},
    {"email": "chris@gmail.com", "username": "Chris", "password": "chris123", "role": "student", "status": "active", "is_verified": True},
    {"email": "jake@gmail.com", "username": "Jake", "password": "jake123", "role": "student", "status": "active", "is_verified": True},
]

def seed_users(db):
    print("FALSICODE: Seeding Users...")
    for u in users_to_seed:
        existing_user = User.query.filter_by(email=u["email"]).first()
        if not existing_user:
            user = User(
                email=u["email"],
                username=u["username"],
                role=u["role"],
                status=u.get("status", "active")
            )
            user.password = generate_password_hash(u["password"]).decode('utf-8')
            user.is_verified = u.get("is_verified", True)
            db.session.add(user)
    db.session.commit()