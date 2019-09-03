set -e

npm run clean

# clear build directory
if [ -d "./build" ]
then
    rm build -r
fi
mkdir build

# build
npm run build
npm run parse-v2-format
npm run update-index-json
cp -r public/* build

# do the git stuff (Adapted from Microsoft/monaco-editor)
COMMITTER_USER_NAME="$(git log --format='%an' -1)"
COMMITTER_EMAIL="$(git log --format='%ae' -1)"
BRANCH_NAME="staging"

cd build
git init
git config user.name "${COMMITTER_USER_NAME}"
git config user.email "${COMMITTER_EMAIL}"
git remote add origin "git@github.com:${COMMITTER_USER_NAME}/JaPNaA.github.io.git"
git checkout -b "${BRANCH_NAME}"
git add .
git commit -m "Stage site"
git push origin "${BRANCH_NAME}" --force