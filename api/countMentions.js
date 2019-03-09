/* eslint-disable camelcase */
const dgraph = require('dgraph-js')
const grpc = require('grpc')
const fetch = require('isomorphic-unfetch')
const fs = require('fs')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

const apiKey = 'ef207284818449c6a1a980a17bc25c42'

const isoDate = new Date().toISOString()

const countMentions = async () => {
  const query = `{
    membersOfCongress(func: eq(congressNumber, 116)) {
      ~memberOfCongress @filter(NOT has(~mentionedCongressPerson)) (first: 250){
        uid
        first_name
        middle_name
        last_name
      }
    }
}`
  const results = await dgraphClient.newTxn().query(query)
  const json = results.getJson()
  const allMembers = json.membersOfCongress[0]['~memberOfCongress']
  let mutationJSON
  // const { uid, first_name, middle_name, last_name } = allMembers[0]
  try {
    mutationJSON = await Promise.all(
      allMembers.map(async ({ uid, first_name, middle_name, last_name }) => {
        const queryString = middle_name
          ? `${first_name},${middle_name},${last_name}`
          : `${first_name},${last_name}`
        try {
          const response = await fetch(
            `https://newsapi.org/v2/everything?q=${queryString}&apiKey=${apiKey}`
          )
          const mentions = await response.json()
          if (Number.isInteger(mentions.totalResults)) {
            const mentionCount = mentions.totalResults
            const txn = dgraphClient.newTxn()
            const mu = new dgraph.Mutation()
            mu.setSetJson({
              mentionCount,
              date: isoDate,
              mentionedCongressPerson: { uid },
            })
            await txn.mutate(mu)
            await txn.commit()
            return {
              mentionCount,
              date: isoDate,
              mentionedCongressPerson: { uid },
            }
          }
          return { uid, error: mentions }
        } catch (error) {
          console.log(error)
          return { uid, error }
        }
      })
    )
    fs.writeFileSync('mutationJSON.json', JSON.stringify(mutationJSON))
  } catch (error) {
    console.error(error)
    fs.writeFileSync('mutationJSON.json', mutationJSON)
  }
}

countMentions().then(() => console.log('finished'))
