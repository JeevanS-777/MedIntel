import chromadb

# Initialize the persistent ChromaDB client
chroma_client = chromadb.PersistentClient(path="./chroma_db")

try:
    # 1. Dynamically get all collections currently existing in your database
    collections = chroma_client.list_collections()
    
    if not collections:
        print("============================================================")
        print(" CHROMADB IS EMPTY. NO COLLECTIONS FOUND.")
        print("============================================================")
        exit()

    print("============================================================")
    print(f" FOUND {len(collections)} COLLECTIONS IN CHROMADB")
    print("============================================================")

    # Sort collection names so report_8 comes before report_9 sequentially
    sorted_collections = sorted(collections, key=lambda c: c.name)

    # 2. Iterate over every single collection found with a sequential counter
    for index, col_info in enumerate(sorted_collections, start=1):
        col_name = col_info.name
        collection = chroma_client.get_collection(name=col_name)
        total_elements = collection.count()
        
        # Displaying clean names "Report 1", "Report 2" instead of raw database values
        print(f"\n[+] TARGET STRUCTURE: Report {index} (Internal Database Source: {col_name})")
        print(f"    Total Vector Density: {total_elements} chunks")
        print("-" * 60)
        
        if total_elements == 0:
            print("    [Collection is currently empty]")
            print("-" * 60)
            continue

        # Pull ALL chunks, metadata, and numerical embedding vectors
        results = collection.get(include=["documents", "metadatas", "embeddings"])
        
        documents = results.get("documents", [])
        metadatas = results.get("metadatas", [])
        embeddings = results.get("embeddings", [])

        # 3. Print out every single chunk and its vector coordinates
        for i in range(len(documents)):
            print(f"    Chunk #{i + 1}")
            print(f"    - Text Content: \"{documents[i]}\"")
            
            # Safely grab the corresponding metadata if it exists
            if metadatas and i < len(metadatas) and metadatas[i]:
                print(f"    - Metadata Profile: {metadatas[i]}")
            
            # FIXED LINE: Safely check if embedding exists without evaluating its truth array value
            if embeddings is not None and i < len(embeddings) and embeddings[i] is not None:
                vector = embeddings[i]
                # Previews first 3 numbers so it doesn't flood your console screen
                vector_preview = f"[{vector[0]:.4f}, {vector[1]:.4f}, {vector[2]:.4f}, ...]"
                print(f"    - Numerical Vector Array: {vector_preview} (Total Dimensions: {len(vector)})")
            else:
                print(f"    - Numerical Vector Array: [No vector matrix mapped]")
                
            print("    " + "." * 50)
        print("-" * 60)

except Exception as e:
    print(f"An unexpected error occurred while scanning ChromaDB layers: {e}")