import { createFileRoute } from '@tanstack/react-router'
import DiceGame from '../components/dice'
export const Route = createFileRoute('/dice')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DiceGame />
}
