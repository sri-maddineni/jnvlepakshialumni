import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate("./../dbkey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def copy_collection(source, destination):
    source = source.strip().lstrip("/")  # Remove leading slash
    destination = destination.strip().lstrip("/")

    docs = db.collection(source).stream()
    count = 0

    for doc in docs:
        data = doc.to_dict()
        db.collection(destination).document(doc.id).set(data)
        count += 1
        print(f"✅ Copied document: {doc.id}")

    print(f"\n🎉 Successfully copied {count} documents from '{source}' → '{destination}'.")

if __name__ == "__main__":
    source_collection = input("Enter the source collection name: ").strip()
    destination_collection = input("Enter the destination collection name: ").strip()

    if not source_collection or not destination_collection:
        print("⚠️ Both source and destination collection names are required.")
    else:
        copy_collection(source_collection, destination_collection)
