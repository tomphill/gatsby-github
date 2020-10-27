const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const totalCountResult = await graphql(`
    {
      github {
        viewer {
          repositories(first: 1, ownerAffiliations: OWNER) {
            totalCount
          }
        }
      }
    }
  `)

  const { totalCount } = totalCountResult.data.github.viewer.repositories

  const numPages = Math.ceil(totalCount / 10)

  let endCursor = null

  for (let i = 0; i < numPages; i++) {
    createPage({
      path: `repos/${i + 1}`,
      component: path.resolve("./src/templates/reposTemplate.js"),
      context: {
        endCursor,
        totalPages: numPages,
      },
    })

    const result = await graphql(`
        {
            github{
                viewer{
                    repositories(first: 10, ownerAffiliations: OWNER, after: ${
                      endCursor ? `"${endCursor}"` : null
                    }){
                        pageInfo{
                            endCursor
                        }
                    }
                }
            }
        }
    `)

    endCursor = result.data.github.viewer.repositories.pageInfo.endCursor
  }
}
