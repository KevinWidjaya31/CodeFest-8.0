import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Int "mo:base/Int";

actor {
    stable var nfts : [NFT] = [];

    type NFT = {
        id : Text;
        name : Text;
        description : Text;
        supply : Int;
        imageData : Text; // Base64 encoded image
    };


    // Fungsi untuk mint NFT baru
    public func mintNFT(name: Text, description: Text, supply: Int, imageData: Text): async Text {
        let id = Int.toText(nfts.size() + 1);
        let newNFT: NFT = {
        id = id;
        name = name;
        description = description;
        supply = supply;
        imageData = imageData;
        };

        // Add the new NFT to the collection
        nfts := Array.append(nfts, [newNFT]);

        Debug.print("NFT Minted: " # name # " (ID: " # id # ")");
        return id;
    };

    // Fungsi untuk mendapatkan semua NFT yang tersedia
    public func getNFTs() : async [NFT] {
        Debug.print("Fetching all NFTs.");
        return nfts;
    };

    // Fungsi untuk mengedit NFT
    public func editNFT(id : Text, newName : Text, newDescription : Text, newSupply : Int, newImageData : Text) : async Bool {
        var found = false;
        nfts := Array.map<NFT, NFT>(
            nfts,
            func(nft) {
                if (nft.id == id) {
                    found := true;
                    return {
                        id = nft.id;
                        name = newName;
                        description = newDescription;
                        supply = newSupply;
                        imageData = newImageData; // Update imageData
                    };
                };
                nft;
            },
        );
        if (found) {
            Debug.print("NFT edited: " # id);
        } else {
            Debug.print("NFT not found: " # id);
        };
        return found;
    };


    // Fungsi untuk menghapus NFT
    public func deleteNFT(id : Text) : async Bool {
        let initialSize = Array.size(nfts);
        nfts := Array.filter<NFT>(
            nfts,
            func(nft) {
                nft.id != id;
            },
        );
        let finalSize = Array.size(nfts);
        let wasDeleted = finalSize < initialSize;
        if (wasDeleted) {
            Debug.print("NFT deleted: " # id);
        } else {
            Debug.print("NFT not found for deletion: " # id);
        };
        return wasDeleted;
    };
};