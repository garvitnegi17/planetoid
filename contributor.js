const REPO_OWNER = "garvitnegi17";
const REPO_NAME = "planetoid";
const GITHUB_TOKEN = "";

async function fetchContributors() {
  const contributorsContainer = document.getElementById("contributors");

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors`,
      {
        headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {},
      }
    );

    if (!response.ok) throw new Error("Failed to fetch contributors");

    const contributors = await response.json();

    contributors.forEach((contributor) => {
      const card = document.createElement("div");
      card.className = "contributor-card";
      const img = document.createElement("img");
      img.src = contributor.avatar_url;
      img.alt = contributor.login;
      const name = document.createElement("h3");
      name.textContent = contributor.login;
      const githubLink = document.createElement("a");
      githubLink.href = contributor.html_url;
      githubLink.target = "_blank";
      githubLink.textContent = "GitHub";
      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(githubLink);
      contributorsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching contributors:", error);
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Failed to load contributors. Please try again.";
    contributorsContainer.appendChild(errorMessage);
  }
}

fetchContributors();
