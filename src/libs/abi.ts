export const ERC20_TRANSFER_ABI = [
  'function transfer(address to, uint256 value) public returns (bool success)',
];
export const ERC20_ABI = [
  ...ERC20_TRANSFER_ABI,
  'function balanceOf(address owner) view returns (uint256)',
];

export const ERC721_TRANSFER_ABI = [
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
];

export const ERC721_ABI = [
  ...ERC721_TRANSFER_ABI,
  'function mintAuto(address to)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
];

export const ERC1155_TRANSFER_ABI = [
  'function safeTransferFrom(address from, address to, uint256 tokenId, uint256 amount, bytes data)',
];

export const ERC1155_ABI = [
  ...ERC1155_TRANSFER_ABI,
  'function mintAuto(address to, uint256 amount, bytes data)',
  'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)',
];
