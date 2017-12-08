import sys
import psycopg2
import random
from faker import Faker

faker = Faker()

# Requirements
# psycopg2
# faker

def gen_fake_geopos():
    return faker.longitude(), faker.latitude()

def gen_nearby_geopos(longitude, latitude, prec):
    return (100 + prec) * longitude / 100


_approx = lambda x, prec : (x * (prec + 100)) / 100

# STRASBOURG LT LG
LATITUDE = 48.583442
LONGITUDE = 7.749987

def gen_random_nearby_geopos(latitude, longitude):
    random_int = random.randint(0, 9) / 10
    return _approx(latitude, random_int), _approx(longitude, random_int)

def bump_real_nearby_data ():
    try:
        conn = psycopg2.connect("dbname='poulet' user='poulet' host='poulet.cw37k6wdsxqk.us-east-2.rds.amazonaws.com' password='c7y10FH98t'")
        cur = conn.cursor()
        # collect types
        cur.execute("SELECT * FROM reports")
        for i in range(0, 10):
            # random_geo_pos
            random_geo_pos = gen_random_nearby_geopos(LATITUDE, LONGITUDE)
            random_type = random.randint(1, 8)
            user_id = 1
            cur.execute("INSERT INTO reports (report_type, latitude, longitude, userid) VALUES ({0}, {1}, {2}, {3});".format(
                random_type, random_geo_pos[0], random_geo_pos[1], user_id
            ))
        conn.commit()
    except:
        print("ERROR")
        sys.exit(0)
