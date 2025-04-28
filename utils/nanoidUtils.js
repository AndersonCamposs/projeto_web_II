async function gerarCodigo(tamanho) {
    const { nanoid } = await import("nanoid");
    return nanoid(tamanho);
}

module.exports = { gerarCodigo }