import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { FaLock } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";
import { RiQuestionLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserPlan } from "../../context/PlanContext";

// STYLED COMPONENTS FOR News Page ----------------------------------->

const LeftCol = styled(Col)`
  border-right: 2px solid var(--main-gray);
  height: 75vh;
  overflow: auto;

  @media (max-width: 993px) {
    border: none;
    margin-bottom: 2rem;
  }
`;

const RightCol = styled(Col)`
  height: 75vh;

  @media (max-width: 993px) {
    border: none;
  }
`;

const MainNewsCol = styled(Col)`
  border-right: 2px solid var(--main-gray);

  @media (max-width: 993px) {
    border: none;
  }
`;

const TopRow = styled(Row)`
  border-bottom: 2px solid var(--main-gray);

  @media (max-width: 993px) {
    border: none;
  }
`;

const BottomRow = styled(Row)`
  height: max-content;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const CardBorderless = styled(Card)`
  border: none;
  width: 100%;
`;

const CardBorderlessFixed = styled(Card)`
  border: none;
  width: 100%;
  height: 100%;
  max-width: 25vw;

  @media (max-width: 768px) {
    max-width: max-content;
  }
`;

const CardTitle = styled(Card.Title)`
  font-weight: bold;
`;

const CardHeadlineTitle = styled(Card.Title)`
  font-weight: bold;
  font-size: 2.25rem;
`;

const CardImg = styled(Card.Img)`
  height: 20rem;
  width: 100%;
  object-fit: cover;
`;

const CardImgSmall = styled(Card.Img)`
  height: 12rem;
  width: 100%;
  object-fit: cover;
`;

const NewsAuthorDiv = styled.div`
  display: flex;
  justify-content: start;
  text-align: center;
  gap: 1rem;
`;

const NewsAuthor = styled(Card.Link)`
  text-decoration: none;
  color: var(--main-positive);

  &:hover {
    color: var(--main-logo);
  }
`;

const NewsDateTime = styled.span`
  margin: auto 0;
  font-size: 0.7rem;
  color: var(--main-secondary);
`;

const ArticleLink = styled.a`
  text-decoration: none;
  color: var(--main-secondary);

  &:hover {
    color: var(--main-darkgray);
  }
`;

const ErrorDiv = styled.div`
  display: flex;
  justify-content: start;
  text-align: center;
  gap: 0.8rem;
  margin: 0;
  padding: 0;
`;
const ErrorMessage = styled.p`
  background-color: var(--main-error);
  color: var(--main-primary);
  padding: 0 0.5rem;
  font-style: italic;
  width: max-content;
`;

const RefreshSymbol = styled(MdOutlineRefresh)`
  font-size: 1.5rem;
  cursor: pointer;
  display: inline;
  color: var(--main-secondary);
`;

const SectionHeader = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: start;
`;

const ButtonLink = styled(Link)`
  font-size: 1rem;
  padding: 0.1rem 0.5rem 0.2rem 0.5rem;
  margin: 0 auto;
  background-color: var(--main-secondary);
  width: max-content;
  text-decoration: none;
  color: var(--main-primary) !important;
  text-decoration: none;
  border: 2px solid var(--main-secondary);

  &:hover {
    color: var(--main-secondary) !important;
    background-color: var(--main-green);
  }
`;

const PaywallDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin: 1rem;
  gap: 0.8rem;
  background-color: var(--main-gray);
  padding: 1rem;

  @media (max-width: 480px) {
    max-width: 85vw;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
`;

const HelperSymbolDiv = styled.span`
  margin: 0 0.5rem;
`;

// FUNCTIONAL COMPONENT ----------------------------------->

const News = () => {
  const [article, setArticle] = useState<any>({});
  const [error, setError] = useState("");
  const [currentPlan] = UserPlan();

  //   GET request for Alpaca Market News
  const fetchNews = async () => {
    try {
      const { data: response } = await axios.get(
        "https://tradewise-demo.herokuapp.com/market-data/alp/news"
      );

      if (response.data) {
        setArticle(response.data);
      } else {
        setError(response.errors);
      }
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
    }
  };

  // On page render, invoke HTTP request
  useEffect(() => {
    setError("");
    setTimeout(() => {
      fetchNews();
    }, 2000);
  }, []);

  // Refresh Handler
  const handleRefresh = () => {
    setError("");
    fetchNews();
  };

  if (currentPlan.plan !== "none") {
    return (
      <>
        {error ? (
          <ErrorDiv>
            <ErrorMessage>
              {error.length > 20 ? `${error.substring(0, 20)}...` : error}
            </ErrorMessage>
            {error ? <RefreshSymbol onClick={handleRefresh} /> : null}
          </ErrorDiv>
        ) : null}

        {/* LEFT COLUMN ------------------------------> */}

        <LeftCol lg={3}>
          <SectionHeader>
            Latest News
            <OverlayTrigger
              placement="auto"
              overlay={
                <Tooltip style={{ pointerEvents: "none" }}>
                  Limited data from Alpaca Markets (Expect repeats)
                </Tooltip>
              }
              popperConfig={{
                modifiers: [
                  {
                    name: "preventOverflow",
                    options: {
                      rootBoundary: "document",
                    },
                  },
                ],
              }}
            >
              <HelperSymbolDiv>
                <RiQuestionLine />
              </HelperSymbolDiv>
            </OverlayTrigger>
          </SectionHeader>
          {Array.isArray(article) ? (
            article
              .filter((article, idx) => idx > 6)
              .map((article, idx) => {
                const date = new Date(article.CreatedAt);
                const newDate = `${date.getDate()}-${date.getMonth() + 1}`;
                const newTime = `${
                  date.getHours() < 10
                    ? `0${date.getHours()}`
                    : `${date.getHours()}`
                }:${
                  date.getMinutes() < 10
                    ? `0${date.getMinutes()}`
                    : `${date.getMinutes()}`
                }`;
                return (
                  <CardBorderless key={idx}>
                    <Card.Body>
                      <NewsAuthorDiv>
                        <NewsAuthor href={article.URL} target="_blank">
                          {article.Author.toUpperCase()}
                        </NewsAuthor>
                        <NewsDateTime>
                          {newDate} AT {newTime}
                        </NewsDateTime>
                      </NewsAuthorDiv>
                      <CardTitle>
                        <ArticleLink href={article.URL} target="_blank">
                          {article.Headline.length > 100
                            ? `${article.Headline.substring(0, 100)}...`
                            : article.Headline}
                        </ArticleLink>
                      </CardTitle>
                    </Card.Body>
                  </CardBorderless>
                );
              })
          ) : (
            <LoadingSpinner>
              <div className="spinner-border" role="status"></div>
            </LoadingSpinner>
          )}
        </LeftCol>

        {/* RIGHT COLUMN ------------------------------> */}
        {/* TOP ROW ------------------------------> */}

        <RightCol lg={9}>
          <TopRow>
            <MainNewsCol lg={8}>
              {Array.isArray(article) ? (
                article
                  .filter((article) =>
                    article.Images.length ? article.Images : article
                  )
                  .filter((article, idx) => idx === 0)
                  .map((article, idx) => {
                    const date = new Date(article.CreatedAt);
                    const newDate = `${date.getDate()}-${date.getMonth() + 1}`;
                    const newTime = `${
                      date.getHours() < 10
                        ? `0${date.getHours()}`
                        : `${date.getHours()}`
                    }:${
                      date.getMinutes() < 10
                        ? `0${date.getMinutes()}`
                        : `${date.getMinutes()}`
                    }`;
                    return (
                      <CardBorderless key={idx}>
                        <CardImg
                          variant="top"
                          src={
                            article.Images.length
                              ? article.Images[0].url
                              : "https://www.investopedia.com/thmb/hATOUQ_Iq5v5CgGKLhrj22v1aXM=/2120x1414/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1300495462-e66753342f304f45a9215505352b596a.jpg"
                          }
                        />
                        <Card.Body>
                          <NewsAuthorDiv>
                            <NewsAuthor href={article.URL} target="_blank">
                              {article.Author.toUpperCase()}
                            </NewsAuthor>
                            <NewsDateTime>
                              {newDate} at {newTime}
                            </NewsDateTime>
                          </NewsAuthorDiv>
                          <CardHeadlineTitle>
                            <ArticleLink href={article.URL} target="_blank">
                              {article.Headline.length > 100
                                ? `${article.Headline.substring(0, 100)}...`
                                : article.Headline}
                            </ArticleLink>
                          </CardHeadlineTitle>
                        </Card.Body>
                      </CardBorderless>
                    );
                  })
              ) : (
                <LoadingSpinner>
                  <div className="spinner-border" role="status"></div>
                </LoadingSpinner>
              )}
            </MainNewsCol>
            <Col lg={4}>
              {Array.isArray(article) ? (
                article
                  .filter((article, idx) => article.Summary)
                  .filter((article, idx) => idx !== 0 && idx < 3)
                  .map((article, idx) => {
                    const date = new Date(article.CreatedAt);
                    const newDate = `${date.getDate()}-${date.getMonth() + 1}`;
                    const newTime = `${
                      date.getHours() < 10
                        ? `0${date.getHours()}`
                        : `${date.getHours()}`
                    }:${
                      date.getMinutes() < 10
                        ? `0${date.getMinutes()}`
                        : `${date.getMinutes()}`
                    }`;
                    return (
                      <CardBorderless key={idx}>
                        <Card.Body>
                          <NewsAuthorDiv>
                            <NewsAuthor href={article.URL} target="_blank">
                              {article.Author.toUpperCase()}
                            </NewsAuthor>
                            <NewsDateTime>
                              {newDate} AT {newTime}
                            </NewsDateTime>
                          </NewsAuthorDiv>
                          <CardTitle>
                            <ArticleLink href={article.URL} target="_blank">
                              {article.Headline.length > 100
                                ? `${article.Headline.substring(0, 100)}...`
                                : article.Headline}
                            </ArticleLink>
                          </CardTitle>
                          <Card.Text>
                            {article.Summary.length > 60
                              ? `${article.Summary.substring(0, 60)}...`
                              : article.Summary}
                          </Card.Text>
                        </Card.Body>
                      </CardBorderless>
                    );
                  })
              ) : (
                <LoadingSpinner>
                  <div className="spinner-border" role="status"></div>
                </LoadingSpinner>
              )}
            </Col>
          </TopRow>

          {/* BOTTOM ROW ------------------------------> */}

          <BottomRow>
            {Array.isArray(article) ? (
              article
                .filter((article) => article.Summary)
                .filter((article, idx) => idx !== 0 && idx < 4)
                .map((article, idx) => {
                  const date = new Date(article.CreatedAt);
                  const newDate = `${date.getDate()}-${date.getMonth() + 1}`;
                  const newTime = `${
                    date.getHours() < 10
                      ? `0${date.getHours()}`
                      : `${date.getHours()}`
                  }:${
                    date.getMinutes() < 10
                      ? `0${date.getMinutes()}`
                      : `${date.getMinutes()}`
                  }`;
                  return (
                    <Col key={idx}>
                      <CardBorderlessFixed>
                        <CardImgSmall
                          variant="top"
                          src={
                            article.Images.length
                              ? article.Images[0].url
                              : "https://www.investopedia.com/thmb/hATOUQ_Iq5v5CgGKLhrj22v1aXM=/2120x1414/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1300495462-e66753342f304f45a9215505352b596a.jpg"
                          }
                        />
                        <Card.Body>
                          <NewsAuthorDiv>
                            <NewsAuthor href={article.URL} target="_blank">
                              {article.Author.toUpperCase()}
                            </NewsAuthor>
                          </NewsAuthorDiv>
                          <CardTitle>
                            <ArticleLink href={article.URL} target="_blank">
                              {article.Headline.length > 100
                                ? `${article.Headline.substring(0, 100)}...`
                                : article.Headline}
                            </ArticleLink>
                          </CardTitle>
                          <Card.Text>
                            {article.Summary.length > 180
                              ? `${article.Summary.substring(0, 180)}...`
                              : article.Summary}
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                          <NewsDateTime>
                            CREATED ON {newDate} AT {newTime}
                          </NewsDateTime>
                        </Card.Footer>
                      </CardBorderlessFixed>
                    </Col>
                  );
                })
            ) : (
              <LoadingSpinner>
                <div className="spinner-border" role="status"></div>
              </LoadingSpinner>
            )}
          </BottomRow>
        </RightCol>
      </>
    );
  } else {
    return (
      <PaywallDiv>
        <span>
          <FaLock /> Upgrade To View Latest News
        </span>
        <ButtonLink to="/plans">View Plans</ButtonLink>
      </PaywallDiv>
    );
  }
};

export default News;
