import React from 'react'
import { Card, Text } from '@rneui/themed'

function CarrierShow({carrier, mcNumber}) {
  return (<>
  <Card>
    <Card.Title >{carrier.legalName ? carrier.legalName : carrier.carrier}</Card.Title>
    <Text style={{color: 'black'}}>DOT #: {carrier.dotNumber}</Text>
    <Text style={{color: 'black'}}>MC #: {mcNumber}</Text>
    <Text style={{color: 'black'}}>Allowed To Operate: {carrier.allowedToOperate === 'Y' || carrier.allowedToOperate === 'Yes' ? 'Yes': 'No'}</Text>
    <Text style={{color: 'black'}}>Address: {carrier.phyStreet} {carrier.phyCity}, {carrier.phyState} {carrier.phyCountry}</Text>
  </Card>
</>
  )
}

export default CarrierShow