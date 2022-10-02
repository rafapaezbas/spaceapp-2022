# Spaceapp challenge 2022 - Measuring open science

## Context

### What is "Open Science"?

Open science is a recently adopted term referring to a new approach in the way of collaboration and distribution of scientific research and its conclusions. The idea is to promote open access to scientific production including publications, data, methodology and any other information that may be useful in scientific advancement.

### How do I know if a scientific production is "Open Science"?

Traditionally, measures such as the number of citations, the entity that publishes the research or the number of published articles have been used to evaluate/measure the quality of a scientific contribution. New criteria are currently emerging that measure the impact, for example the impact on social networks.

A currently widely accepted standard is _Transparency and Openness Promotion (TOP)_ promoted by the association [Center For Open Science](https://www.cos.io/), a non-governmental initiative that advocates for the support of the opening of the investigation.

The _TOP_ criterion is based on 6 sections:

- Citation standard: measures the adequacy of the citations of the publication.

- Transparency of data, analytical method and resources: it measures whether the material used during the investigation is available and how easy it is to access.

- Transparency of design and analysis: it measures how easy it is for the reader of an article to follow the method used and therefore verify the conclusions.

- Pre-registration of studies: measures the public distribution of research prior to being published by a publisher or magazine.

- Pre-registration of the analysis plan: measures the public distribution of the analysis prior to the investigation before being published.

- Replication: measures the interest and thoroughness in the publication of [replication studies](https://www.enago.com/academy/importance-of-replication-studies/#:~:text=What%20is%20Replication% 20of%20a,to%20the%20newly%20collected%20data.).

Visit link for a more detailed description of the criteria: https://osf.io/9f6gx/wiki/Guidelines/

In addition, Center For Open Science offers a platform for the administration and publication of scientific articles. The platform allows users to store and manage research, with a special focus on the transparency of the process, data and conclusions.

Some characteristics of centralized publishing (as is the case of the Center For Open Science platform) are:

1. The publishing institutions have a trusted status that helps to give credibility to the authorship of the publications, that is, if an institution says that the scientific article with [DOI](https://www.doi.org/) _10 .1000/xyz123_ is the authorship of the researcher with [ORCID](https://es.wikipedia.org/wiki/ORCID) _0000-0000-0000-000X_, the credibility of the institution is the basis of the statement.

2. Centralized distribution of articles is a single point of failure vulnerable to censorship, security issues, or technical/financial issues.

3. The trusted status of the institution would allow the modification of publications or censorship by the institution itself.

## Improvement proposal for the distribution.

The proposed improvements for distribution are based on digital signature and checksum schemes.
As a digital signature scheme [Ed25519](https://en.wikipedia.org/wiki/EdDSA) is currently the most developed. The idea is simple, each institution and researcher is identified with a public key that corresponds to a private key used for the digital signature. Any user can use the public key for verification.

```
const signable = 'Random_message'
const signature = ed25519.sign(signable, privateKey)

// Verification returns boolean value

const isVerified = ed25519.verify(signable, signature, publicKey) 
```

Checksum is the result of a hash function that transforms any data source into its unique 32/64-bit representation.

Only these two ideas solve the question of verified authorship! The institutions could publish the author's signature on the checksum of the scientific article.

```
const publication = readFile('/path/to/article')
const checksum = hash(publication)
const signature = ed25519.sign(checksum, investigatorPrivateKey)
```

Since the public key is in the public domain, any reader can verify that it is true. The institution cannot modify the article either, as it would change the checksum and therefore the signature.

But this still leaves two problems:

1. The institution or an external body could simply delete the article. Block access and deny its existence.

2. The publication date cannot be verified either, for example, in a dispute over which of two articles was published earlier.

To solve these two problems, a decentralized consensus algorithm is needed. Currently, the most widespread algorithm in this field is _Proof of work_, used by the Bitcoin system. Therefore, the bitcoin block chain can be used as a source of truth, since the blocks are unchangeable once they are added to the chain.

The idea is to add additional information to a transaction or block where a digital signature is included:

```
const info = {
    publicationChecksum,
    investigatorPublicKey,
    investigatorSignature,
    publicationLink: 'http://institution-domain....'
}

const signature = ed25519.sign(info, institutionPrivateKey)
```

If this signature is included in a block, it is true that the entity commits to publish by a specific means (_link_), a specific article (_publicationChecksum_) and attributes its authorship to a researcher who acknowledges the authorship of the article (_investigatorSignature_).

To add the information to a bitcoin transaction, the operator [OP_RETURN](https://en.bitcoin.it/wiki/OP_RETURN) can be used.

```
const data = Buffer.from('signature, 'utf8');
const embed = bitcoin.payments.embed({ data: [data] });
const psbt = new bitcoin.Psbt({ network: testnet })
	.addInput(inputData)
	.addOutput({
		script: embed.output,
		value: 1000,
	})
	.signInput(0, keyPair)

psbt.finalizeAllInputs()
```


In addition this gives a verifiable publication order. If the signature of article A has been published in an earlier block than article B, it is certain that article A is earlier.

## Additional consequence

A direct consequence of using blockchain is the complete *decentralization* of publishing. A researcher could take the option to self-publish an article. You just have to include a transaction in the block chain in the form:

```
const info = {
    publicationChecksum
}

const signature = ed25519.sign(info, investigatorPrivateKey)
```

In essence using the blockchain as a registry of intellectual property.

Now the author can distribute their article in any way they see fit and can prove their authorship and blockchain height at the time of publication.

Especially interesting would be if the article were distributed through some decentralization protocol such as [BitTorrent](https://es.wikipedia.org/wiki/BitTorrent#DHT), whose protocol is highly resistant to censorship. Any reader could verify that the article has not been modified.

## Conclusions

A new criterion could be added for publications that meet the described protocol. One could speak of various levels of decentralization:

Level 1: the researcher and the institution use the digital signature scheme.

Level 2: The digital signature is published on the blockchain.

Level 3: The article is distributed in a decentralized way.
