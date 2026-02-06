FROM gitpod/workspace-full

RUN bash -c ". /home/gitpod/.nvm/nvm.sh && nvm install 22 && nvm use 22 && nvm alias default 22"
