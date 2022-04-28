import updateCandyMachine from '../scripts/updateCandyMachine'

describe('will update the candy machine', () => {
  it('can update the candy machine', async () => {
    await updateCandyMachine()
  })
})
