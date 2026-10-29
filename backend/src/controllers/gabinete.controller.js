const { repo } = require('../lib/data-source');

const GABINETE_FIELDS = {
    id: true,
    nombre: true,
    marca: true,
    costoUnitario: true,
    stockActual: true,
    stockMinimo: true,
    createdAt: true,
    updatedAt: true,
    activo: true,
    formato: true,
    materialChasis: true,
    panel: true,
    tamano: true,
    categoriaId: true,
};

const productoResponse = (gabinete) => {
    const { imagen, ...datos } = gabinete;
    return {
        ...datos,
        imagenUrl: `productos/${encodeURIComponent(gabinete.id)}/imagen?v=${gabinete.updatedAt ? new Date(gabinete.updatedAt).getTime() : 0}`,
    };
};

// Obtener todos los gabinetes activos
async function obtenerGabinetes(req, res) {
    try {
        const gabinetes = await repo('gabinete').find({
            where: { activo: true },
            select: GABINETE_FIELDS,
        });

        // Convertir los campos Decimal a número para evitar problemas de serialización en JSON
        const gabinetesMapeados = gabinetes.map(gab => ({
            ...productoResponse(gab),
            costoUnitario: Number(gab.costoUnitario)
        }));

        return res.status(200).json(gabinetesMapeados);
    } catch (error) {
        console.error("Error al obtener gabinetes:", error);
        return res.status(500).json({ error: 'Error al obtener los gabinetes' });
    }
}

// Obtener un gabinete específico por su ID
async function obtenerGabinetePorId(req, res) {
    try {
        const { id } = req.params;
        const gabinete = await repo('gabinete').findOne({
            where: { id },
            select: GABINETE_FIELDS,
        });

        if (!gabinete || !gabinete.activo) {
            return res.status(404).json({ error: 'Gabinete no encontrado' });
        }

        // Convertir Decimal a número por seguridad
        const gabineteMapeado = {
            ...productoResponse(gabinete),
            costoUnitario: Number(gabinete.costoUnitario)
        };

        return res.status(200).json(gabineteMapeado);
    } catch (error) {
        console.error("Error al obtener el gabinete:", error);
        return res.status(500).json({ error: 'Error al obtener el gabinete' });
    }
}

async function listarTamanosConfigurador(req, res) {
    try {
        const tamanos = await repo('tamanoconfigurador').find({
            where: { activo: true },
            order: { precioBase: 'ASC' },
        });
        return res.json(tamanos.map((tamano) => ({
            ...tamano,
            precioBase: Number(tamano.precioBase),
        })));
    } catch (error) {
        console.error('Error al obtener los tamaños del configurador:', error);
        return res.status(500).json({
            error: 'No se pudieron obtener los tamaños del configurador.',
        });
    }
}

async function validarConfiguracionPorTamano(req, res) {
    const { tamanoId, materialIds, accesorioIds, cantidad = 1 } = req.body || {};
    if (
        typeof tamanoId !== 'string' ||
        !Array.isArray(materialIds) ||
        !Array.isArray(accesorioIds) ||
        materialIds.some((id) => typeof id !== 'string') ||
        accesorioIds.some((id) => typeof id !== 'string') ||
        materialIds.length === 0 ||
        !Number.isInteger(cantidad) ||
        cantidad < 1
    ) {
        return res.status(400).json({
            error: 'La configuración debe incluir un tamaño, al menos un material y una cantidad válida.',
        });
    }

    try {
        const tamano = await repo('tamanoconfigurador').findOneBy({
            codigo: tamanoId,
            activo: true,
        });
        if (!tamano) {
            return res.status(409).json({
                error: 'El tamaño seleccionado ya no está disponible.',
                noDisponibles: [{
                    id: tamanoId,
                    nombre: tamanoId,
                    motivo: 'El tamaño está inactivo o ya no existe.',
                }],
            });
        }

        const noDisponibles = [];
        const materiales = [];
        const revisarMateriales = async (ids, esAccesorio) => {
            for (const id of new Set(ids)) {
                const material = await repo('material').findOneBy({ id });
                const tipoCorrecto =
                    material && (material.categoria === 'ACCESORIO') === esAccesorio;

                if (!tipoCorrecto) {
                    noDisponibles.push({
                        id,
                        nombre: 'Opción seleccionada',
                        motivo: 'Ya no está disponible.',
                    });
                } else if (!material.activo || Number(material.stockActual) < cantidad) {
                    noDisponibles.push({
                        id,
                        nombre: material.nombre,
                        motivo: `Stock insuficiente para la cantidad solicitada (${cantidad}).`,
                    });
                } else if (material.costoUnitario == null) {
                    noDisponibles.push({
                        id,
                        nombre: material.nombre,
                        motivo: 'No tiene un precio registrado.',
                    });
                } else {
                    materiales.push(material);
                }
            }
        };

        await revisarMateriales(materialIds, false);
        await revisarMateriales(accesorioIds, true);

        if (noDisponibles.length) {
            return res.status(409).json({
                error: 'Hay opciones que ya no están disponibles. Modificá la configuración.',
                noDisponibles,
            });
        }

        const precioUnitario = Number(tamano.precioBase) +
            materiales.reduce((total, material) => total + Number(material.costoUnitario), 0);
        return res.json({
            disponible: true,
            precioUnitario,
            total: precioUnitario * cantidad,
        });
    } catch (error) {
        console.error('Error al validar la configuración por tamaño:', error);
        return res.status(500).json({
            error: 'No se pudo validar la disponibilidad de la configuración.',
        });
    }
}

async function validarConfiguracion(req, res) {
    if (typeof req.body?.tamanoId === 'string') {
        return validarConfiguracionPorTamano(req, res);
    }

    const { gabineteId, materialIds, accesorioIds, cantidad = 1 } = req.body || {};
    if (
        typeof gabineteId !== 'string' ||
        !Array.isArray(materialIds) ||
        !Array.isArray(accesorioIds) ||
        materialIds.some((id) => typeof id !== 'string') ||
        accesorioIds.some((id) => typeof id !== 'string') ||
        materialIds.length === 0 ||
        !Number.isInteger(cantidad) ||
        cantidad < 1
    ) {
        return res.status(400).json({ error: 'La configuración debe incluir un gabinete, al menos un material y una cantidad válida.' });
    }

    try {
        const gabinete = await repo('gabinete').findOneBy({ id: gabineteId });
        const noDisponibles = [];

        if (!gabinete || !gabinete.activo || !(Number(gabinete.stockActual) >= cantidad)) {
            noDisponibles.push({
                id: gabineteId,
                nombre: gabinete?.nombre || 'Gabinete seleccionado',
                motivo: `Stock insuficiente para la cantidad solicitada (${cantidad}).`,
            });
        }

        const revisarMateriales = async (ids, esAccesorio) => {
            for (const id of new Set(ids)) {
                const material = await repo('material').findOneBy({ id });
                const tipoCorrecto = material && (material.categoria === 'ACCESORIO') === esAccesorio;

                if (!tipoCorrecto) {
                    noDisponibles.push({ id, nombre: 'Opción seleccionada', motivo: 'Ya no está disponible.' });
                } else if (!material.activo || !(Number(material.stockActual) >= cantidad)) {
                    noDisponibles.push({
                        id,
                        nombre: material.nombre,
                        motivo: `Stock insuficiente para la cantidad solicitada (${cantidad}).`,
                    });
                } else if (material.costoUnitario == null) {
                    noDisponibles.push({ id, nombre: material.nombre, motivo: 'No tiene un precio registrado.' });
                }
            }
        };

        await revisarMateriales(materialIds, false);
        await revisarMateriales(accesorioIds, true);

        if (noDisponibles.length) {
            return res.status(409).json({
                error: 'Hay opciones que ya no están disponibles. Modificá la configuración.',
                noDisponibles,
            });
        }

        const materiales = [];
        for (const id of new Set([...materialIds, ...accesorioIds])) {
            const material = await repo('material').findOneBy({ id });
            materiales.push(material);
        }
        const total = Number(gabinete.costoUnitario) +
            materiales.reduce((sum, material) => sum + Number(material.costoUnitario), 0);

        return res.json({ disponible: true, total: total * cantidad });
    } catch (error) {
        console.error('Error al validar la disponibilidad de la configuración:', error);
        return res.status(500).json({ error: 'No se pudo validar la disponibilidad de la configuración.' });
    }
}

module.exports = {
    obtenerGabinetes,
    obtenerGabinetePorId,
    listarTamanosConfigurador,
    validarConfiguracionPorTamano,
    validarConfiguracion,
};