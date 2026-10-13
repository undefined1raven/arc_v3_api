function base64UrlToArrayBuffer(base64Url: string): ArrayBuffer {
  // Replace URL-safe characters with standard Base64 characters
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  // Decode the Base64 string to a binary string
  const binaryString = Buffer.from(base64, 'base64').toString('binary');

  // Create an ArrayBuffer from the binary string
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return arrayBuffer;
}

export { base64UrlToArrayBuffer };
