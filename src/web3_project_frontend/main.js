import { Actor, HttpAgent } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";

// Definisikan IDL manual
const idlFactory = ({ IDL }) => {
    return IDL.Service({
        'mintNFT': IDL.Func([IDL.Text, IDL.Text], [], ['oneway']),
        'buyNFT': IDL.Func([IDL.Nat], [], ['oneway']),
        'getNFTs': IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Text, IDL.Text, IDL.Bool))], ['query']),
    });
};

const agent = new HttpAgent();
const nftMarketplace = Actor.createActor(idlFactory, {
    agent,
    canisterId: "bd3sg-teaaa-aaaaa-qaaba-cai" // Ganti dengan ID canister backend Anda
});

async function fetchNFTs() {
    const nfts = await nftMarketplace.getNFTs();
    const nftList = document.getElementById("nft-list");
    nftList.innerHTML = '';
    nfts.forEach(nft => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <p><strong>${nft[1]}</strong></p>
            <img src="${nft[2]}" alt="${nft[1]}" width="100" />
            <p>Status: ${nft[3] ? 'For Sale' : 'Sold'}</p>
            ${nft[3] ? `<button onclick="buyNFT(${nft[0]})">Buy NFT</button>` : ''}
        `;
        nftList.appendChild(listItem);
    });
}

async function mintNFT(event) {
    event.preventDefault();
    const name = document.getElementById("nft-name").value;
    const url = document.getElementById("nft-url").value;
    if (name && url) {
        await nftMarketplace.mintNFT(name, url);
        document.getElementById("nft-name").value = '';
        document.getElementById("nft-url").value = '';
        fetchNFTs();
    }
}

async function buyNFT(id) {
    await nftMarketplace.buyNFT(id);
    fetchNFTs();
}

document.addEventListener("DOMContentLoaded", fetchNFTs);
