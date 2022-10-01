# Spaceapp challenge 2022 - Measuring open science

## Contexto

### ¿Qué es la "Ciencia abierta"?

Ciencia abierta (Open Science) es un término de adopción reciente referido a un nuevo enfoque en el modo de colaboración y distribución de la investigación científica y sus conclusiones. La idea es promover el acceso abierto a la producción científica incluyendo publicaciones, datos, metodología y cualquier otra información que pueda ser útil en el avance científico.

### ¿Cómo sé si una producción científica es "Ciencia Abierta"?

Tradicionalmente, se han utilizado medidas como el número de citas, la entidad que publica la investigación o el número de artículos publicados para evaluar/medir la calidad de un aporte científico. Actualmente están surgiendo nuevos criterios que miden el impacto, por ejemplo el impacto en redes sociales. 

Un estándar con bastante aceptación en la actualidad es _Transparency and Openness Promotion (TOP)_ promovido por la asociación [Center For Open Science](https://www.cos.io/), una iniciativa no gubernamental que aboga por el apoyo a la apertura de la investigación. 

El criterio _TOP_ se basa en 6 apartados:

- Estándar de citación: mide la adecuación de las citas de la publicación.

- Transparencia de datos, método analítico y recursos: mide si el material utilizado durante la investigación está disponible y la facilidad de acceso.

- Transparencia de diseño y análisis: mide la facilidad que tiene el lector de un artículo para seguir el método utilizado y por tanto verificar la conclusiones.

- Preregistro de estudios: mide la distribución pública de la investigación previamente a ser publicada por una editorial o revista.

- Preregistro del plan de análisis: mide la distribución pública del análisis previo a la investigación antes de ser publicada.

- Réplica: mide el interés y rigurosidad en la publicación de [réplicas de estudios](https://www.enago.com/academy/importance-of-replication-studies/#:~:text=What%20is%20Replication%20of%20a,to%20the%20newly%20collected%20data.).

Visita enlace para una descripción mas detallada de los criterios: https://osf.io/9f6gx/wiki/Guidelines/

Además Center For Open Science ofrece una plataforma de administración y publicación de artículos científicos. La plataforma permite a los usuarios el almacenamiento y gestión de la investigación, con especial enfoque el la transparencia del proceso, datos y conclusiones.

Algunas caracterísiticas de la publicación centralizada (como es el caso de la plataforma de Center For Open Science) son:

1. Las instituciones publicadoras tienen un estatus de confianza que ayuda a dar credibilidad a la autoría de las publicaciones, es decir, si una institución dice que el artículo cientifico con [DOI](https://www.doi.org/) _10.1000/xyz123_ es autoría del investigador con [ORCID](https://es.wikipedia.org/wiki/ORCID) _0000-0000-0000-000X_, la credibilidad de la instititución es la base de la afirmación.

2. La distribución centralizada de los artículos es un único punto de fallo vulnerable a censura, problemas de seguridad o problemas técnicos/económicos.

3. El estatus de confianza de la institución permitiría la modificación de publicaciones o censura por parte de la propia institución.

## Propuesta de mejora para la distribución.

Las mejoras propuestas para la distribución se basan en esquemas de firma digital y suma de verificación (checksum).
Como esquema de firma digital [Ed25519](https://en.wikipedia.org/wiki/EdDSA) es el más desarrollado actualmente. La idea es simple, cada institución e investigador es identificado con una clave pública que corresponde a una clave privada utilizada para la firma digital. Cualquier usuario puede utilizar la clave pública para la verificación.

```
const signable = 'Random_message'
const signature = ed25519.sign(signable, privateKey)

// Verification returns boolean value

const isVerified = ed25519.verify(signable, signature, publicKey) 
```

Checksum o suma de verificación es una función hash que transforma cualquier fuente de información es su representación única de 32/64 bits.

Sólo estas dos ideas resuelven la questión de autoría verificada! Las instituciones podrían publicar la firma del autor sobre el checksum del artículo científico. 

```
const publication = readFile('/path/to/article')
const checksum = hash(publication)
const signature = ed25519.sign(checksum, investigatorPrivateKey)
```

Dado que la clave pública es de dominio público cualquier lector puede verificar que se cumple. La institución tampoco puede modificar el artículo, pues cambiaría el checksum y por tanto, la firma.

Pero esto aún deja dos problemas:

1. La institución o un organismo externo podrían simplemente eliminar el artículo. Bloquear el acceso y negar su existencia.

2. Tampoco se puede verificar la fecha de publicación, por ejemplo, en una disputa sobre cuál de dos artículos se publicó antes.

Para resolver estos dos problemas se necesita un algoritmo de consenso descentralizado. En la actualidad, el algoritmo más extendido en este campo es _Proof of work_, utilizado por el sistema Bitcoin. Por lo tanto, se puede utilizar la cadena de bloques de bitcoin como fuente de verdad, pues los bloques son inmodificables una vez se añaden a la cadena.

La idea es añadir información adicional a una transacción o bloque donde se incluya una firma digital:

```
const info = {
    publicationChecksum,
    investigatorPublicKey,
    investigatorSignature,
    publicationLink: 'http://institution-domain....'
}

const signature = ed25519.sign(info, institutionPrivateKey)
```

Si esta firma se incluye en un bloque, es cierto que la entidad se compromote a publicar por un medio concreto (_link_), un artículo concreto (_publicationChecksum_) y atribuye su autoría a un investigador que reconoce la autoría del artículo (_investigatorSignature_).

Para añadir la información a una transacción bitcoin puede usarse el operador [OP_RETURN](https://en.bitcoin.it/wiki/OP_RETURN). 

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

Además esto da un orden de publicación verificable. Si la firma del artículo A se ha publicado en un bloque anterior al artículo B, es seguro que el artículo A es anterior.

## Consecuencia adicional

Una consecuencia directa del uso de cadena de bloques es la completa *descentralización* de publicación. Un investigador podría tomar la opción de auto publicar un artículo. Sólo tiene incluir una transacción en la cadena de bloques de la forma:

```
const info = {
    publicationChecksum
}

const signature = ed25519.sign(info, investigatorPrivateKey)
```

En esencia usando la cadena de bloques como un registro de propiedad intelectual.

Ahora el autor puede distribuir su artículo de la forma que crea conveniente y puede probar su autoría y altura de la cadena de bloques en el momento de la publicación.

Especialmente interesante sería que se distribuyera el artículo por medio de algún protocol de descentralización tal como [BitTorrent](https://es.wikipedia.org/wiki/BitTorrent#DHT), cuyo protocolo es altamente resistente a la censura. Cualquier lector podría verificar que el artículo no ha sido modificado.

## Conclusiones

Podría añadirse un nuevo criterio para las publicaciones que cumplieran el protocol descrito. Podría hablarse de varios niveles de descentrailzación:

Nivel 1: el investigador y la institución usan el esquema de firma digital.

Nivel 2: La firma digital está publicada en cadena de bloques.

Nivel 3: El artículo se distribuye de forma descentralizada.

### Fron end
