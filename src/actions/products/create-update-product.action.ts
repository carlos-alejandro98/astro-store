
import { defineAction } from 'astro:actions';
import { getSession } from 'auth-astro/server';
import { z } from 'zod';
import { v4 as UUID } from 'uuid';
import { db, eq, Product } from 'astro:db';

const MAX_FILE_SIZE = 5_000_000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
];

export const createUpdateProduct = defineAction({
    accept: 'form',
    input: z.object({
        id: z.string().optional(),
        description: z.string(),
        gender: z.string(),
        price: z.number(),
        sizes: z.string(),
        slug: z.string(),
        stock: z.number(),
        tags: z.string(),
        title: z.string(),
        type: z.string(),

        imageFiles: z.array(
            z.instanceof(File)
                .refine(file => file.size <= MAX_FILE_SIZE, 'Max image size 5MB')
                .refine(file => {
                    if( file.size === 0 ) return true;
                    
                    return ACCEPTED_IMAGE_TYPES.includes(file.type);
                }, `Only supported image files are valid, ${ACCEPTED_IMAGE_TYPES.join(',')}` )
        ).optional(),
    }),
    handler: async (form, { request }) => {

        const session = await getSession(request);
        const user = session?.user;

        //Podemos validar si el usuario tiene permisos para realizar esta acción

        if (!user) {
            throw new Error('Unauthorized');
        }

        const { id = UUID(), imageFiles, ...rest } = form;
        rest.slug = rest.slug.toLowerCase().replace(' ', '-').trim();

        const product = {
            id: id,
            user: user.id!,
            ...rest
        };

        if (!form.id) {
            await db.insert(Product).values(product);
        } else {
            await db.update(Product).set(product).where(eq(Product.id, id));
        }

        // Imagenes
        console.log({imageFiles});

        return product;
    }
});

