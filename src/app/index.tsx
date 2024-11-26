import Routing from 'pages/index'
import { CombinedProviders } from './lib'

export default function App() {
  return (
    <CombinedProviders>
      <Routing />
    </CombinedProviders>
  )
}
