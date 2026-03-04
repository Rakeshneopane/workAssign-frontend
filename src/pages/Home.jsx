import {TaskSection} from "./Tasks"
import { ProjectSection } from "./Projects"
import { TeamSection } from "./Teams"

export default function Home(){
  
  return (
        <>
          <ProjectSection />
          <TaskSection />
          <TeamSection />
        </>
  )
}