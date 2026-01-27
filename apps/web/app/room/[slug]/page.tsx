import Canvas from "../../../components/Canvas"

export default async function Page({ params }: {
    params: {
        slug: string
    }
}) {

    const slug = (await params).slug

    console.log(slug)

    return <Canvas slug={slug} />

}