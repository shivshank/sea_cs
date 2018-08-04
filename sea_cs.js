// The Silly Entity "a" Component System (the a's just there to sound good, okay! jeez)

function SeaCs() {
    /* maps c_sets to buckets (caches matching buckets to speed up iteration) */
    this.system_reqs = {}
    this.entity_buckets = []
}

SeaCs.prototype.add_entity = function(comps) {
    // list of components to (sorted) string of identifiers => "component1 component2"
    const comp_kinds = Object.keys(comps)
    const c_set = make_c_set(comp_kinds)
    let bucket = this.entity_buckets.find((b) => b.c_set === c_set)
    if (bucket === undefined) {
        this.entity_buckets.push({
            c_set,
            comp_kinds,
            entities: [make_storage(comps)]
        })
    } else {
        const reusing = bucket.entities.find((e) => e.dead)
        if (reusing !== undefined) {
            make_storage(
                comps,
                reusing
            )
        } else {
            bucket.entities.push(make_storage(comps))
        }
    }
}

SeaCs.prototype.join = function(comp_kinds, f) {
    const c_set = make_c_set(comp_kinds)
    if (this.system_reqs[c_set] === undefined) {
        // we need to build the cache
        const cache = []
        // find all buckets that have all these components
        for (const b of this.entity_buckets) {
            let valid = true
            for (const kind of comp_kinds) {
                if (b.comp_kinds.indexOf(kind) === -1) {
                    // a component is missing, skip this bucket
                    valid = false
                    break
                }
            }
            if (valid) {
                cache.push(b)
            }
        }
        this.system_reqs[c_set] = cache
    }
    const buckets = this.system_reqs[c_set]
    for (const b of buckets) {
        for (const e of b.entities) {
            f(e.comps)
        }
    }
}

SeaCs.prototype.print_all = function() {
    for (const b of this.entity_buckets) {
        for (e of b.entities) {
            console.log("Entity:", e.comps)
        }
    }
}

function make_storage(comps, dead_storage) {
    if (dead_storage === undefined) {
        return {
            version: 0,
            dead: false,
            comps
        }
    } else {
        if (!dead_storage.dead) {
            throw "tried to reuse storage that wasn't dead!"
        }
        dead_storage.version += 1
        dead_storage.dead = false
        dead_storage.comps = comps
    }
}

/* list of component kind strings => "c_set" (opaque bucket descriptor) */
function make_c_set(comp_kinds) {
    const c_set = comp_kinds.slice()
    c_set.sort()
    return c_set.join(" ")
}
