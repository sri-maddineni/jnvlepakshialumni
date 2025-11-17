import firebase_admin
from firebase_admin import credentials, auth, firestore

# ============ CONFIGURE ONLY THIS ============
COLLECTION_NAME = "aajnvl/alumni/all alumni"   # <-- Change this to your collection name
# =============================================

# Initialize Firebase Admin
cred = credentials.Certificate("dbkey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def update_user_photos(collection_name):
    collection_ref = db.collection(collection_name)
    docs = collection_ref.stream()

    for doc in docs:
        data = doc.to_dict()
        email = data.get("email")

        if not email:
            print(f"Skipping document {doc.id}: No email found")
            continue

        try:
            user = auth.get_user_by_email(email)

            photo_url = user.photo_url

            if not photo_url:
                print(f"No photoURL for {email}")
                continue

            # Update Firestore document
            collection_ref.document(doc.id).update({
                "photoURL": photo_url
            })

            print(f"Updated photoURL for: {email}")

        except auth.UserNotFoundError:
            print(f"No Firebase Auth user found for: {email}")
        except Exception as e:
            print(f"Error updating {email}: {e}")

# Run the update
update_user_photos(COLLECTION_NAME)
