-- CreateTable
CREATE TABLE "public"."Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT,
    "imagem" TEXT,
    "quantidade" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);
