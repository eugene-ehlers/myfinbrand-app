FROM public.ecr.aws/lambda/python:3.11

# Install Python deps into /opt/python so they’re available at runtime
COPY requirements.txt .
RUN python -m pip install --no-cache-dir -r requirements.txt -t /opt/python

# Copy handler code
COPY src/ /var/task/

# Lambda entrypoint (handler function in app.py)
CMD [ "app.lambda_handler" ]
