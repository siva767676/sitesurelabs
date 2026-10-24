import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

log = logging.getLogger("app.errors")


class ApiError(Exception):
    """Domain error rendered as {"error": {"code", "message", "fields"?}}."""

    def __init__(self, status: int, code: str, message: str, fields: dict[str, str] | None = None, headers: dict[str, str] | None = None):
        self.status, self.code, self.message, self.fields, self.headers = status, code, message, fields, headers
        super().__init__(message)


def _body(code: str, message: str, fields: dict[str, str] | None = None) -> dict:
    err: dict = {"code": code, "message": message}
    if fields:
        err["fields"] = fields
    return {"error": err}


def _friendly(msg: str) -> str:
    # pydantic prefixes custom validator messages with "Value error, "
    return msg.removeprefix("Value error, ")


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(ApiError)
    async def _api_error(_: Request, exc: ApiError):
        return JSONResponse(_body(exc.code, exc.message, exc.fields), status_code=exc.status, headers=exc.headers)

    @app.exception_handler(RequestValidationError)
    async def _validation(_: Request, exc: RequestValidationError):
        fields: dict[str, str] = {}
        for e in exc.errors():
            loc = [p for p in e["loc"] if p != "body"]
            key = str(loc[0]) if loc else "_"
            fields.setdefault(key, _friendly(e["msg"]))
        return JSONResponse(_body("validation_error", "Please check the highlighted fields and try again.", fields), status_code=422)

    @app.exception_handler(StarletteHTTPException)
    async def _http(_: Request, exc: StarletteHTTPException):
        code = {404: "not_found", 405: "method_not_allowed", 401: "unauthorized"}.get(exc.status_code, "http_error")
        return JSONResponse(_body(code, str(exc.detail)), status_code=exc.status_code, headers=getattr(exc, "headers", None))

    @app.exception_handler(Exception)
    async def _unhandled(request: Request, exc: Exception):
        log.exception("unhandled error", extra={"ctx": {"path": request.url.path}})
        return JSONResponse(_body("server_error", "Something went wrong on our side. Please try again in a moment."), status_code=500)
