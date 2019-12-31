echo "Depoy start..."

cd dist
git init
git add .
git commit -m "Published"
git remote add origin https://gitee.com/lipengzhou/topline-mobile-preview.git
git push origin master:gh-pages -f

echo "Depoy Successful."
