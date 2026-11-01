from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
limiter = Limiter(key_func=get_remote_address, default_limits=['200/day'])
cors = CORS(supports_credentials=True, resources={r'/api/*': {'origins': ['http://localhost:*', 'http://127.0.0.1:*']}})
