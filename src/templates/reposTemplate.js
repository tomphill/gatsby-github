import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import "./style.css"

export const query = graphql`
  query ReposQuery($endCursor: String) {
    github {
      viewer {
        repositories(first: 10, ownerAffiliations: OWNER, after: $endCursor) {
          nodes {
            name
            id
            url
            description
            stargazerCount
            stargazers(first: 10) {
              nodes {
                id
                avatarUrl(size: 50)
              }
            }
          }
        }
      }
    }
  }
`

const ReposTemplate = props => {
  const { totalPages } = props.pageContext
  return (
    <Layout>
      {props.data.github.viewer.repositories.nodes.map(node => (
        <div key={node.id} className="card">
          <h1>
            <a target="_blank" rel="noreferrer" href={node.url}>
              {node.name}
            </a>
          </h1>
          <div>{node.description}</div>
          <p>
            <span role="img" aria-label="starry eyes">
              🤩
            </span>{" "}
            <strong>Stargazers</strong>{" "}
            <span className="stargazers-count">{node.stargazerCount}</span>
          </p>
          <div className="stargazers">
            {node.stargazers.nodes.map(sNode => (
              <div key={sNode.id}>
                <img alt="stargazer avatar" src={sNode.avatarUrl} />
              </div>
            ))}
          </div>
          {!node.stargazers.nodes.length && (
            <div className="no-stargazers">No stargazers :(</div>
          )}
          {!!(node.stargazerCount - node.stargazers.nodes.length) && (
            <div>
              + {node.stargazerCount - node.stargazers.nodes.length} more!
            </div>
          )}
        </div>
      ))}
      <div className="pages">
        {Array.from({ length: totalPages }).map((p, i) => {
          return (
            <div key={i}>
              <Link to={`/repos/${i + 1}`}>{i + 1}</Link>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

export default ReposTemplate
