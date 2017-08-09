const Xray = require('x-ray');
const xray = Xray();
const compose = require('ramda').compose
const trim = require('ramda').trim
const split = require('ramda').split
const map = require('ramda').map
const filter = require('ramda').filter
const contains = require('ramda').contains
const nth = require('ramda').nth
const toLower = require('ramda').toLower
const props = require('ramda').props
const either = require('ramda').either
const ifElse = require('ramda').ifElse

exports.handler = (event, context, callback) => {
  xray('https://www.severnbridge.co.uk/Home.aspx?.Parent=&FileName=current-bridge-status7', '#Main_ctl00_ctl00_upList')(function(err, status) {
    const statusesAsList = compose(
      map(
        compose(
          ifElse(
            (status) => status === true,
            () => "open",
            () => "closed"
          ),
          either(
            contains("open"),
            contains("high-sided")
          )
        )
      ),
      (statuses) => (
        {
          bridgeM4: statuses[0],
          bridgeM48: statuses[1],
        }
      ),
      props([1, 3]),
      map(compose(toLower, trim)),
      filter((line) => {
        return trim(line) !== ""
      }),
      split('\n'),
      trim
    )(status)

    callback(null, statusesAsList)
    // console.log(statusesAsList)
  })

}
