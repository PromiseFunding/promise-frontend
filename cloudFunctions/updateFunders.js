Moralis.Cloud.afterSave("FunderAdded", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info("Funder Added :D")
})
