const dgraph = require('dgraph-js')
const grpc = require('grpc')
const fs = require('fs')
const politicalParties = require('./politicalParties.json')
const states = require('./states.json')
const house = require('./house.json')
const senate = require('./senate.json')

const schema = fs.readFileSync('./schema.gz', 'utf8')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

async function resetDB() {
  const op = new dgraph.Operation()
  op.setDropAll(true)
  await dgraphClient.alter(op)
}

async function setSchema() {
  const operation = new dgraph.Operation()
  operation.setSchema(schema)
  try {
    await dgraphClient.alter(operation)
  } catch (error) {
    console.error(error)
  }
}

const congressNumber = {
  uid: '_:congressNumber',
  congressNumber: 116,
}

const getPartyUID = partyLetter => {
  const party = politicalParties.find(
    ({ abbreviation }) => partyLetter === abbreviation
  )

  if (!party) {
    console.log(partyLetter)
    return '_:I'
  }
  return party.uid
}

const getStateUID = stateLetter => {
  const state = states.find(({ abbreviation }) => stateLetter === abbreviation)
  if (!state) {
    console.log(stateLetter)
    return '_:LA'
  }
  return state.uid
}

async function formatData() {
  const houseMembers = house.results[0].members
  const senateMembers = senate.results[0].members
  const congressMembers = [...houseMembers, ...senateMembers]
  const formattedCongressMembers = congressMembers.map(member => ({
    ...member,
    date_of_birth: new Date(member.date_of_birth).toISOString(),
    party: { uid: getPartyUID(member.party) },
    state: { uid: getStateUID(member.state) },
    memberOfCongress: { uid: '_:congressNumber' },
  }))
  return formattedCongressMembers
}

async function setData(congressMembers) {
  const transaction = dgraphClient.newTxn()
  try {
    const mutation = new dgraph.Mutation()
    mutation.setSetJson([
      congressNumber,
      ...politicalParties,
      ...states,
      ...congressMembers,
    ])
    await transaction.mutate(mutation)
    await transaction.commit()
  } catch (error) {
    console.error(error)
  } finally {
    await transaction.discard()
  }
}

resetDB()
  .then(() => setSchema())
  .then(() => formatData())
  .then(congressMembers => setData(congressMembers))
  .then(() => console.log('finished'))
