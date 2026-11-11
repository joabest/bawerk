import type { Metadata } from 'next'
import HomeClient from './HomeClient'
export const metadata: Metadata = {
 title: 'Bawerk Solutions | você pode ir além do que imagina',
 description: 'Sites, software sob medida, CRM, automação, marketing e design. Uma nova experiência digital para a Bawerk Solutions.',
 alternates: {canonical:'https://bawerk.solutions/site3/'}
}
export default function Site3Home(){return <HomeClient/>}
