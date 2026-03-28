import { useNavigate } from "react-router-dom";
import { Button, Heading, Text, LazyImage } from "../components/ui";
import { PageWrapper, MainContent } from "../components/layout";
import '../styles/home.css'

function Home() {
  const navigate = useNavigate();

  const img = '/ohio_outline.png'
  const imgSrcSet = `${img} 1120w, ${img} 560w, ${img} 320w`
  const imgSizes = '(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw'

  return (
    <PageWrapper>
      <MainContent>
        <div className="welcome-page">
          <div className="welcome-panel">
            <div className="welcome-left" aria-hidden="true">
              <LazyImage src={img} alt="Ohio outline" className="welcome-image" width={560} height={420} srcSet={imgSrcSet} sizes={imgSizes} />
            </div>

            <div className="welcome-right">
              <div className="welcome-message">
                <Heading level={1}>Welcome to Campus Events</Heading>
                <Text>Connect with student groups, discover campus activities, and stay involved.</Text>

                <div className="welcome-actions">
                  <Button onClick={() => navigate('/login')}>Login</Button>
                  <Text className="muted-note">Don't have an account?</Text>
                  <Button onClick={() => navigate('/create-account')}>Sign up here</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainContent>
    </PageWrapper>
  )
}

export default Home;
